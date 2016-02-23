function dracoify(yamlString) {
    var yaml = jsyaml.load(yamlString);

    //Fixing TOSCA imports
    //TODO placeholder for draco-types publishing URL
    yaml.imports.push("draco-types:raw.githubusercontent.com/jacopogiallo/DrACO/master/definitions/draco-types.tosca");
    var imports = yaml.imports;
    yaml.imports = [];
    $.each(imports, function (index, imp) {
        var impObject = {}
        impObject[imp.split(':')[0]] = imp.split(':')[1];
        yaml.imports.push(impObject);
    });

    // Getting offering (name, object)
    var nodeName = Object.keys(yaml.topology_template.node_templates)[0];
    var node = yaml.topology_template.node_templates[nodeName];

    // Fixing description and template name
    yaml.template_name = "cloud_offering_" + nodeName;
    yaml.description = "A discovered cloud offering.";

    // Removing "resource_type" property
    if (node.properties.resource_type) delete node.properties.resource_type;
    
    // Renaming properties
    move(node.properties, "location", node.properties, "service_name");
    if (node.properties.hardwareId) {
        node.properties.service_name += ":" + node.properties.hardwareId;
        delete node.properties.hardwareId;
    }
    if (node.properties.region) {
        node.properties.service_name += ":" + node.properties.region;
        delete node.properties.region;
    }

    // IaaS offering
    if((node.type.indexOf("Compute") > -1)) {
        node.type = "draco.nodes.IaaS";

        // Creating "host" capability
        var capContainerProperties = {};
        move(node.properties, "num_cpus", capContainerProperties, "num_cpus");
        move(node.properties, "disk_size", capContainerProperties, "disk_size");
        move(node.properties, "ram", capContainerProperties, "mem_size");
        move(node.properties, "performance", capContainerProperties, "cpu_SPECint");
        move(node.properties, "disk_type", capContainerProperties, "disk_type");
        move(node.properties, "num_disks", capContainerProperties, "num_disks");
        // Adding "host" capability to IaaS offering
        if(Object.keys(capContainerProperties).length > 0) {
            if (!node.capabilities) node["capabilities"] = {};
            node.capabilities["host"] = createCapability(capContainerProperties);
        }
    }

    // PaaS offering
    if (node.type.indexOf("Platform") > -1) {
        node.type = "draco.nodes.PaaS";

        // Removing "performance" property
        delete node.properties.performance;

        // Creating "host" capability
        var capHostingProperties = {};
        move(node.properties, "private_hosting", capHostingProperties, "private_hosting");
        move(node.properties, "public_hosting", capHostingProperties, "public_hosting");

        // Creating "software_support" field of "host" capability
        var capHostingSWSupportProperty = {};
        moveSupport(node.properties, "go", capHostingSWSupportProperty, "go");
        moveSupport(node.properties, "java", capHostingSWSupportProperty, "java");
        moveSupport(node.properties, "jetty", capHostingSWSupportProperty, "jetty");
        moveSupport(node.properties, "node", capHostingSWSupportProperty, "nodejs");
        moveSupport(node.properties, "php", capHostingSWSupportProperty, "php");
        moveSupport(node.properties, "python", capHostingSWSupportProperty, "python");
        moveSupport(node.properties, "ruby", capHostingSWSupportProperty, "ruby");
        moveSupport(node.properties, "tomcat", capHostingSWSupportProperty, "tomcat");
        if (Object.keys(capHostingSWSupportProperty).length > 0)
            capHostingProperties["software_support"] = capHostingSWSupportProperty;
        // Creating "datastore_support" field of "host" capability
        var capHostingDBSupportProperty = {};
        moveSupport(node.properties, "memcached", capHostingDBSupportProperty, "memcached");
        moveSupport(node.properties, "mongodb", capHostingDBSupportProperty, "mongodb");
        moveSupport(node.properties, "mysql", capHostingDBSupportProperty, "mysql");
        moveSupport(node.properties, "postgresql", capHostingDBSupportProperty, "postgresql");
        moveSupport(node.properties, "redis", capHostingDBSupportProperty, "redis");
        if (Object.keys(capHostingDBSupportProperty).length > 0)
            capHostingProperties["datastore_support"] = capHostingDBSupportProperty;
        // Adding "host" capability to PaaS offering
        if (Object.keys(capHostingProperties).length > 0) {
            if (!node.capabilities) node["capabilities"] = {};
            node.capabilities["host"] = createCapability(capHostingProperties);
        }

        capScalableProperties = {};
        move(node.properties, "auto_scaling", capScalableProperties, "auto");
        move(node.properties, "horizontal_scaling", capScalableProperties, "horizontal");
        move(node.properties, "vertical_scaling", capScalableProperties, "vertical");
        // Adding "scalable" capability to PaaS offering
        if (Object.keys(capScalableProperties).length > 0) {
            if (!node.capabilities) node["capabilities"] = {};
            node.capabilities["scalable"] = createCapability(capScalableProperties);
        }
    }
    
    // Creating "policies"
    var policies = [];

    // Creating "availability" policy
    if(Object.keys(node.properties).indexOf("availability") > -1) {
        var avaPolPropList = {};
        node.properties.availability = node.properties.availability * 100;
        move(node.properties, "availability", avaPolPropList, "uptime_percentage");
        policies.push(createPolicy("availability", "draco.policies.Availability", avaPolPropList, nodeName));
    }

    // Creating "location" policy
    if (Object.keys(node.properties).indexOf("city") > -1 ||
        Object.keys(node.properties).indexOf("country") > -1 ||
        Object.keys(node.properties).indexOf("continent") > -1) {
        var locPolPropList = {};
        move(node.properties, "city", locPolPropList, "city");
        move(node.properties, "country", locPolPropList, "country");
        move(node.properties, "continent", locPolPropList, "continent");
        policies.push(createPolicy("location", "draco.policies.Location", locPolPropList, nodeName));
    }

    // Creating "pricing" policy
    if (Object.keys(node.properties).indexOf("cost") > -1) {
        var pricePolPropList = {};
        move(node.properties, "cost", pricePolPropList, "cost");
        policies.push(createPolicy("pricing", "draco.policies.Pricing", pricePolPropList, nodeName));
    }

    // Adding policies (if any)
    if (policies.length > 0) yaml.topology_template["policies"] = policies;

    return jsyaml.dump(yaml);
}

/*
 * This function moves a key-value pair from a source object to a target object (potentially renaming the key)
 */
function move(sourceObj, sourceKey, targetObj, targetKey) {
    if (Object.keys(sourceObj).indexOf(sourceKey) > -1) {
        targetObj[targetKey] = sourceObj[sourceKey];
        if (isNaN(targetObj[targetKey])) targetObj[targetKey] = targetObj[targetKey].toLowerCase();
        delete sourceObj[sourceKey];
    }
}

/**
 * This function:
 * - removes <sourceName>_support and <sourceName>_version keys from sourceObj,
 * - merges them in <sourceName>_support: [<sourceName>_version], and
 * - insert the merged pair into the targetObj.
 */
function moveSupport(sourceObj, sourceName, targetObj, targetName) {
    var support = sourceName+"_support";
    var version = sourceName+"_version";
    if (Object.keys(sourceObj).indexOf(support) > -1) {
        delete sourceObj[support];
        var versions = [];
        if (Object.keys(sourceObj).indexOf(version) > -1) {
            versions.push(sourceObj[version]);
            delete sourceObj[version];
        }
        targetObj[targetName] = versions;
    }
}


/**
 * This function creates an object representing (the content of) a capability with the specified properties.
 */
function createCapability(capabilityProperties) {
    var capabilityFeatures = {};
    capabilityFeatures["properties"] = capabilityProperties;
    return capabilityFeatures;
}

/**
 * This function creates an object representing a policy to be associated with the targetNode.
 */
function createPolicy(policyName, policyType, policyPropertyList, targetNode) {
    // Creating policy description (i.e., properties, type, targets)
    var policyFeatures = {};
    policyFeatures["type"] = policyType;
    policyFeatures["properties"] = policyPropertyList;
    var targets = [];
    targets.push(targetNode);
    policyFeatures["targets"] = targets;

    // Creating (a Map representing) the policy to be returned
    var policy = {};
    policy[policyName] = policyFeatures;
    return policy;
}
