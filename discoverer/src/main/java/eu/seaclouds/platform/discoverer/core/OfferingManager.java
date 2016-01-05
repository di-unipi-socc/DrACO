/**
 * Copyright 2014 SeaClouds
 * Contact: SeaClouds
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

package eu.seaclouds.platform.discoverer.core;

import com.mongodb.*;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import org.bson.Document;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

public class OfferingManager {

    private final MongoCollection<Document> offeringsCollection;

    public HashMap<String, String> offeringNameToOfferingId =  new HashMap<>();

    public OfferingManager(MongoCollection<Document> collection) {
        this.offeringsCollection = collection;
    }

    public String getOfferingId(String offeringName) {
        return offeringNameToOfferingId.get(offeringName);
    }

    /**
     * Get the list of all offering ids
     *
     * @return the list of all offering ids
     */
    public Collection<String> getAllOfferingIds() {
        return offeringNameToOfferingId.values();
    }

    /**
     * Get an offering
     *
     * @param offeringId the id of the offering
     * @return the offering identified by offeringId
     */
    public Offering getOffering(String offeringId) {
        /* input check */
        if(offeringId == null)
            throw new NullPointerException("The parameter \"cloudOfferingId\" cannot be null.");

        BasicDBObject query = new BasicDBObject("offering_id", offeringId);
        FindIterable<Document> cursor = this.offeringsCollection.find(query);

        return Offering.fromDB(cursor.first());
    }

    /**
     * Add a new offering in the repository (by creating the the YAML file
     * containing the TOSCA and the JSON file containing meta information)
     *
     * @param offering the Offering to add
     * @return the id of the added Offering
     */
    public String addOffering(Offering offering) {
        this.removeOffering(offering.getId());
        this.offeringsCollection.insertOne(offering.toDBObject());
        this.offeringNameToOfferingId.put(offering.getName(), offering.getId());
        return offering.getId();
    }

    /**
     * Remove an offering
     *
     * @param offeringId the id of the offering to remove
     * @return
     */
    public boolean removeOffering(String offeringId) {
        if(offeringId == null)
            throw new NullPointerException("The parameter \"cloudOfferingId\" cannot be null.");

        BasicDBObject query = new BasicDBObject("offering_id", offeringId);
        Document removedOffering = this.offeringsCollection.findOneAndDelete(query);

        return removedOffering != null;
    }

    /**
     * Initialize the list of offerings known by the discoverer
     *
     */
    public void initializeOfferings() {
        FindIterable<Document> offerings = this.offeringsCollection.find();

        for (Document d : offerings) {
            offeringNameToOfferingId.put((String) d.get("offering_name"), (String) d.get("offering_id"));
        }
    }

    /**
     * Generates a single offering file containing all node templates fetched
     *
     * @param offeringNodeTemplates node templates to write on file
     */
    public void generateSingleOffering(String offeringNodeTemplates) {
        this.removeOffering("0");
        Offering singleOffering = new Offering("all");
        singleOffering.toscaString = offeringNodeTemplates;
        this.addOffering(singleOffering);
    }
}


