package eu.draco.platform.discoverer.core;

public class OfferingTest {
    String toscaPayload = "tosca_definitions_version: tosca_simple_yaml_1_0_0_wd03\n" +
            "description: \n" +
            "template_name: \n" +
            "template_version: 1.0.0-SNAPSHOT\n" +
            "template_author: \n" +
            "\n" +
            "imports:\n" +
            "  - tosca-normative-types:1.0.0.wd03-SNAPSHOT\n" +
            "\n" +
            "topology_template:\n" +
            "  node_templates:\n" +
            "    aws-ec2:us-west-2:\n" +
            "      type: seaclouds.nodes.Compute.Amazon\n" +
            "      properties:\n" +
            "        num_cpus: 4\n" +
            "        availability: 0.98\n" +
            "        cost: 0.928 usd_per_hour\n" +
            "        performance: 62 ecb\n";


}