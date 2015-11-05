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

package eu.draco.platform.discoverer.API;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.google.common.base.Optional;
import eu.draco.platform.discoverer.core.Discoverer;

/* core */
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.ArrayList;


@Path("/add")
@Produces({MediaType.TEXT_HTML, MediaType.APPLICATION_JSON})
public class AddAPI implements IAPI {
	
	/* vars */
	private Discoverer discoverer;

	private String HTMLForm = "<html>\n" +
			"\t<head>\n" +
			"\t\t<title>SeaClouds Discoverer - Add Offering Manually</title>\n" +
			"\t</head>\n" +
			"\t\n" +
			"\t<body>\n" +
			"\t\t<p1>Manual feeder</p1>\n" +
			"\t\t<form name=\"form1\" method=\"post\" action=\"./addoffer\">\n" +
			"\t\t\t<p2>Enter TOSCA Offering in the text area below:</p2><br/>\n" +
			"\t\t\t<textarea name=\"tosca_in\" rows=\"20\" cols=\"100\"></textarea><br/>\n" +
			"\t\t\t<input type=\"submit\" value=\"Add offering\" />\n" +
			"\t\t</form>\n" +
			"\t</body>\n" +
			"</html>";

	public AddAPI() {
		this.discoverer = Discoverer.instance();
	}

	@GET
	public String getAddOfferingForm() {
		return this.HTMLForm;
	}

	@POST
	public AddRepresentation addOfferFromTOSCA(@QueryParam("tosca_in") Optional<String> optionalTOSCAIn) {

		ArrayList<String> addedOfferingIds = new ArrayList<>();
//		String TOSCAIn = optionalTOSCAIn.get();
//
//		if(optionalTOSCAIn.isPresent()) {
//			try {
//				Offering newOffer = Offering.fromTosca(TOSCAIn);
//				String offeringId = this.discoverer.addOffer(newOffer);
//				addedOfferingIds.add(offeringId);
//			} catch (ParsingException | IOException e) { }
//
//		}

		return new AddRepresentation(addedOfferingIds);
	}

	private class AddRepresentation {

		private ArrayList<String> addedOfferingIds;

		public AddRepresentation(ArrayList<String> addedOfferingIds) {
			this.addedOfferingIds = addedOfferingIds;
		}

		@JsonProperty("added_offerings")
		public ArrayList<String> getAddedOfferings() {
			return addedOfferingIds;
		}
	}
}
