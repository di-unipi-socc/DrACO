var providerMap = JSON.parse('{ "Ninefold_Virtual_Servers":"Ninefold_Virtual_Servers", "Microsoft_Azure_Virtual_Machines": "Microsoft_Azure_Virtual_Machines", "SoftLayer_Cloud_Servers": "SoftLayer_Cloud_Servers", "DigitalOcean": "DigitalOcean", "Cloud_Computing_by_Aruba": "Cloud_Computing_by_Aruba", "Liquid_Web_Storm_Servers": "Liquid_Web_Storm_Servers", "Amazon_EC2": "Amazon_EC2", "Cumulogic_Elastic_WebStack": "Cumulogic_Elastic_WebStack", "OpenShift_Online": "OpenShift_Online", "Vultr": "Vultr", "Google_Compute_Engine": "Google_Compute_Engine", "Rackspace_Cloud_Servers": "Rackspace_Cloud_Servers", "BareMetalCloud": "BareMetalCloud", "CenturyLink_Cloud_Servers": "CenturyLink_Cloud_Servers", "CloudSigma": "CloudSigma", "Getup_Cloud": "Getup_Cloud", "Modulus": "Modulus", "UpCloud": "UpCloud", "Linode_Cloud_Hosting": "Linode_Cloud_Hosting", "City_Cloud": "City_Cloud", "Lunacloud_Compute": "Lunacloud_Compute", "HP_Cloud_Compute": "HP_Cloud_Compute", "Voxoz": "Voxoz", "exoscale_Apps": "exoscale_Apps", "Cloudhelix_VMWare_Cloud_Hosting": "Cloudhelix_VMWare_Cloud_Hosting", "Trucker_io": "Trucker_io", "Jelastic": "Jelastic", "Pagoda_Box": "Pagoda_Box", "vnCloud": "vnCloud", "Pivotal_Web_Services": "Pivotal_Web_Services", "HP_Helion_Development_Platform": "HP_Helion_Development_Platform", "Cloudn_PaaS": "Cloudn_PaaS", "fortrabbit": "fortrabbit", "Apache_Stratos": "Apache_Stratos", "Tsuru": "Tsuru", "Terremark_vCloud_Express": "Terremark_vCloud_Express", "IBM_Bluemix": "Bluemix", "mOSAIC": "mOSAIC", "Railscloud": "Railscloud", "Oktawave_Cloud": "Oktawave_Cloud", "Cloudnode": "Cloudnode", "Force_com": "Force_com", "IDC_Frontier_Cloud": "IDC_Frontier_Cloud", "App42_PaaS": "App42_PaaS", "Deis": "Deis", "AppScale": "AppScale", "Exoscale_Compute": "Exoscale_Compute", "e24cloud_Cloud_Servers": "e24cloud_Cloud_Servers", "Rapidcloud_io": "Rapidcloud_io", "iKnode": "iKnode", "Amazon_Elastic_Beanstalk": "Amazon_Elastic_Beanstalk", "Cloudways": "Cloudways", "Pogoapp": "Pogoapp", "Microsoft_Azure": "Microsoft_Azure", "Oracle_Cloud_PaaS": "Oracle_Cloud_PaaS", "AppHarbor": "AppHarbor", "Cloudify": "Cloudify", "Pivotal CF": "Pivotal_CF", "Webbynode": "Webbynode", "Webappcabaret": "Webappcabaret", "Software AG Live": "Software_AG_Live", "CloudUnit": "CloudUnit", "ElasticBox": "ElasticBox", "Flynn": "Flynn", "Cloud_Heat_App_Elevator": "Cloud_Heat_App_Elevator", "SAP_HANA_Cloud": "SAP_HANA_Cloud", "ConPaaS": "ConPaaS", "Heroku": "Heroku", "Standing Cloud": "Standing_Cloud", "Nitrous_io": "Nitrous_io", "Clever_Cloud": "Clever_Cloud", "Gondor": "Gondor", "OpenShift_Origin": "OpenShift_Origin", "OrangeScape": "OrangeScape", "Nuvla": "Nuvla", "PythonAnywhere": "PythonAnywhere", "Platformer_com": "Platformer_com", "Cloud_66": "Cloud_66", "MoPaaS": "MoPaaS", "cloudControl": "cloudControl", "Scalingo": "Scalingo", "CatN": "CatN", "brightbox": "brightbox", "Apprenda": "Apprenda", "AppFog": "AppFog", "Platform_sh": "Platform_sh", "dotCloud": "dotCloud", "BitNami": "BitNami", "Mendix": "Mendix", "Shelly_Cloud": "Shelly_Cloud", "EngineYard": "EngineYard", "Viaduct": "Viaduct", "Anynines": "Anynines", "Acquia_Cloud": "Acquia_Cloud", "Heirloom_PaaS": "Heirloom_PaaS", "WSO2_App_Cloud": "WSO2_App_Cloud", "Cloud_Foundry": "Cloud_Foundry", "Google_App_Engine": "Google_App_Engine", "OutSystems_Platform": "OutSystems_Platform", "OpenShift_Enterprise": "OpenShift_Enterprise" }');

function replaceAll(text, oldstring, newstring) {
    while(text.indexOf(oldstring) > -1)
        text = text.replace(oldstring,newstring);
    return text;
}

function unkey(text) {
    text = replaceAll(text, '_com', '.com');
    text = replaceAll(text, '_org', '.org');
    text = replaceAll(text, '_io', '.io');

    text = replaceAll(text, '_', ' ');

    return text;
}

function rekey(text) {
    text = replaceAll(text, '.com', '_com');
    text = replaceAll(text, '.org', '_org');
    text = replaceAll(text, '.io', '_io');

    text = replaceAll(text, ' ', '_');

    return text;
}