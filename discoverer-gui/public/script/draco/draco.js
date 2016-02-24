//Placeholder: URL Discoverer
var dracoURL = 'http://52.49.115.206:1236/discoverer/fetchif?' // 'http://seaclouds.di.unipi.it:1236/discoverer/fetchif?' 

// Offering properties (to specify filters)
var properties = {
    availability: "Availability",
    cost: "Cost (EUR/h)",
    disk_size: "Disk size (GB)",
    ram: "Memory size (GB)",
    num_cpus: "Number of CPUs",
    performance: "Performance (SPECint value)"
}

// Software support (to specify filters)
var sw = {
    java_support: "Java",
    scala_support: "Scala",
    go_support: "Go",
    node_support: "NodeJS",
    php_support: "PHP",
    python_support: "Python",
    ruby_support: "Ruby",
    tomcat_support: "Tomcat",
    mysql_support: "MySQL",
    postgresql_support: "PostgreSQL",
    mongodb_support: "MongoDB",
    memcached_support: "Memcached",
    redis_support: "Redis",
    jetty_support: "Jetty"
}

// Placeholder for fetched offerings
var offerings;

/* 
 * This function fills the "Cloud provider" selector.
 * It exploits list available providers in "providerMap.js"
 * [Used in: body.onload]
 */
function loadProviders() {
    $('#selectProvider')[0].innerHTML = '<option value="Any">Any</option>';
    $.each(Object.keys(providerMap).sort(), function (i, k) {
        $('#selectProvider')[0].innerHTML += '<option value="' + k + '">' + unkey(k) + '</option>';
    });
}

/*
 * This function permits adding a requirement about the offering(s) to be retrieved.
 * It exploits the list of available "properties"
 * [Used in: add-filter-btn.onclick] 
 */
function addFilter() {
    // Creating outer div
    var outerF = document.createElement('div');
    outerF.className = 'form-group sea-filter';
    $('#additional-reqs-fieldset')[0].insertBefore(outerF, $('#addLinkBox')[0]);

    // Creating inner div
    var innerF = document.createElement('div');
    innerF.className = 'col-lg-10';
    outerF.appendChild(innerF);

    // Creating key selector
    var selectKeyF = document.createElement('select');
    selectKeyF.className = 'form-control sea-filter-key';
    selectKeyF.type = 'text';
    selectKeyF.style = 'float:left; width: 40%; display: inline';
    var alreadyAddedKeys = [];
    $('.sea-filter-key').each(function () { alreadyAddedKeys.push(this.value) })
    $.each(Object.keys(properties).sort(), function (index, key) {
        if (alreadyAddedKeys.indexOf(key) == -1) {
            var opt = document.createElement('option');
            opt.value = key;
            opt.text = properties[key];
            selectKeyF.appendChild(opt);
        }
    });
    innerF.appendChild(selectKeyF);

    // Creating operator selector
    var selectOpF = document.createElement('select');
    selectOpF.className = 'form-control sea-filter-operator';
    selectOpF.type = 'text';
    selectOpF.style = 'float:left; width:10%';
    selectOpF.innerHTML = '<option value="=">=</option> <option value="<"><</option> <option value=">">></option>';
    innerF.appendChild(selectOpF);

    // Creating value input
    var inputValF = document.createElement('input');
    inputValF.className = 'form-control';
    inputValF.type = 'text';
    inputValF.placeholder = 'Value';
    inputValF.style = 'float:left; width: 40%; display: inline';
    innerF.appendChild(inputValF);

    // Hiding add button if no more reqs can be specified
    if (Object.keys(properties).length == alreadyAddedKeys.length + 1)
        $('#add-filter-btn').hide();
}

/*
 * This function permits adding a requirement on the software that have to be supported by the retrieved offering(s).
 * It exploits the list of available "sw"
 * [Used in: add-ss-btn.onclick] 
 */
function addSoftwareSupport() {
    // Creating outer div
    var outerSS = document.createElement('div');
    outerSS.className = 'form-group sea-ss';
    $('#additional-reqs-fieldset')[0].insertBefore(outerSS, $('#addLinkBox')[0]);

    // Creating inner div
    var innerSS = document.createElement('div');
    innerSS.className = 'col-lg-10';
    outerSS.appendChild(innerSS);

    // Creating selector
    var selectSS = document.createElement('select');
    selectSS.className = 'form-control sea-ss-key';
    selectSS.type = 'text';
    selectSS.style = 'width: 90%';
    innerSS.appendChild(selectSS);

    // Creating selector items
    var addedSS = [];
    $('.sea-ss-key').each(function () { addedSS.push(this.value) })
    $.each(Object.keys(sw).sort(), function (i, k) {
        if (addedSS.indexOf(k) == -1) {
            var opt = document.createElement('option');
            opt.value = k;
            opt.text = sw[k];
            selectSS.appendChild(opt);
        }
    });

    // Hiding add button if no more support can be specified
    if (Object.keys(sw).length == addedSS.length + 1)
        $('#add-ss-btn').hide();
}

/*
 * This function resets the GUI by removing all filters/results.
 * [Used in: clear-btn.click]
 */
function clearAll() {
    // Reset filters
    $('#optAll')[0].click();
    $('#selectProvider')[0].value = "Any";
    $('.sea-filter').remove();
    $('.sea-ss').remove();

    // Clear results
    clearResults();

    // Re-show buttons (if hidden)
    $('#add-filter-btn').show();
    $('#add-ss-btn').show();
}

/*
 * This function clears results.
 * [Used in: clearAll, find]
 */
function clearResults() {
    $('.query-result').remove();
}

/*
 * This function builds and performs a query to the remote RESTful API (according to the specified filters).
 * It also adds the results to the bottom of the GUI.
 * [Used in: find-btn.click]
 */
function find() {
    // Creating filters for query
    var filter = {};
    var excluded = [];

    // Adding filters on properties
    $('.sea-filter-key').each(function (index, input) {
        var key = input.value;
        var operator = input.nextSibling.value;
        var value = input.nextSibling.nextSibling.value;
        if (key == 'availability') value = (value / 100).toString();
        if (value != '') filter[key] = [operator, value];
    });

    // Adding filters on software support
    $('.sea-ss-key').each(function (index, selector) {
        filter[selector.value] = ['in', 'true'];
    });

    // Adding filter on offering type (all,iaas,paas)
    $('.offering-type').each(function () {
        if (this.checked && this.value != 'all')
            filter['resource_type'] = ['in', this.value];
    });

    // Creating fieldset for showing results
    clearResults();
    var resultField = document.createElement('fieldset');
    resultField.className = 'query-result';
    $('#query-div')[0].appendChild(resultField);
    var resultLegend = document.createElement('legend');
    resultLegend.textContent = 'Discovered TOSCA YAML cloud offerings';
    resultField.appendChild(resultLegend);
    var resultDiv = document.createElement('div');
    resultDiv.id = 'query-response';
    resultField.appendChild(resultDiv);
    resultDiv.innerHTML = '<img id="throbber" src="img/throbber.gif" style="margin-left:48%; max-width:3%"/> ';

    // Setting up the invocation to the remote RESTful API
    var url = dracoURL;
    var provider = rekey($('#selectProvider')[0].value);
    url += 'constraints=' + encodeURI(JSON.stringify(filter));
    //Adding filter on provider (if not "any")
    if (provider != 'Any') url += '&provider=' + providerMap[provider];

    // Clearing previously fetched offerings
    offerings = {};

    // Performing the remote invocation
    $.ajax({
        type: "GET",
        url: url,
        crossDomain: true,
        jsonp: false,
        dataType: "json",
        success: function (results, status, jqXHR) {
            if ($.isEmptyObject(results)) $('#query-response')[0].innerHTML = "<pre> No offerings satisying specified filters </pre>";
            else {
                // Creating hashmap of results ("offering_id"->"offering")
                if (!$.isArray(results)) results = [results];
                $.each(results, function (kk, result) {
                    offerings[result.offering_id] = dracoify(result.offering);
                });

                // Creating selector for query results
                var offeringSelector = document.createElement('select');
                offeringSelector.id = 'offering-selector';
                offeringSelector.className = 'form-control';
                offeringSelector.type = 'text';
                offeringSelector.style = 'width: 90%';
                $('#query-response')[0].appendChild(offeringSelector);

                // Filling selector for query results
                $.each(Object.keys(offerings).sort(), function (i, k) {
                    var opt = document.createElement('option');
                    opt.text = k;
                    opt.value = k;
                    offeringSelector.appendChild(opt);
                });

                // Creating 'pre' showing selected offering
                var offeringPre = document.createElement('pre');
                offeringPre.id = 'offering-pre';
                offeringPre.style = 'width: 90%';
                $('#query-response')[0].appendChild(offeringPre);

                // Filling 'pre' according to selected offering
                $("#offering-selector").change(function () {
                    $("#offering-pre")[0].innerHTML = offerings[$("#offering-selector")[0].value];
                });
                $("#offering-selector").change();

                $('#throbber')[0].remove();
            }
        },
        error: function (jqXHR, status) {
            $('#query-response')[0].innerHTML = "ERROR: SeaClouds Discoverer cannot be reached at the specified URL (see below).";
        }
    });
}
