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

package eu.draco.platform.discoverer.Crawler;

import eu.draco.platform.discoverer.core.Discoverer;
import eu.draco.platform.discoverer.core.Offering;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;


@SuppressWarnings("serial")
public class CrawlerManager implements Runnable {
	/* consts */
	private static int SLEEP_HOURS = 24; // 24h by default

	/* vars */
	private Thread backThread;
	private int tick;
	private boolean crawlOnStartup;

	private ArrayList<SCCrawler> activeCrawlers = new ArrayList<>();
	private static HashMap<String, SCCrawler> availableCrawlers = new HashMap<>();
	static {
		availableCrawlers.put(CloudHarmonyCrawler.Name, new CloudHarmonyCrawler());
		availableCrawlers.put(PaasifyCrawler.Name, new PaasifyCrawler());
	}

	public int crawledTimes;
	public int totalCrawledOfferings;
	public Date lastCrawl;


	public CrawlerManager() {
		/* stats */
		crawledTimes = 0;
		totalCrawledOfferings = 0;
		lastCrawl = null;

		this.tick = 1000 * 60 * 60 * CrawlerManager.SLEEP_HOURS;
		this.backThread = new Thread(this);
	}

	public void startCrawling(int refreshInterval, boolean crawlOnStartup, ArrayList<String> activeCrawlers) {

		this.crawlOnStartup = crawlOnStartup;

		CrawlerManager.SLEEP_HOURS = refreshInterval;
		for (String crawlerName : activeCrawlers) {
			SCCrawler crawler = availableCrawlers.get(crawlerName);

			if (crawler != null)
				this.activeCrawlers.add(crawler);
		}

		this.backThread.start();
	}

	/* *********************************************************** */
	/* *****                  back thread                    ***** */
	/* *********************************************************** */
	private void run_helper() throws InterruptedException {
		/* endless main loop */
		while(true)
		{
			/* crawl */
			for(SCCrawler crawler : activeCrawlers)
                crawler.crawl();

            /* crawlers have crawled, it is possible to create single file offering */
			Discoverer.instance().generateSingleOffering();

            /* statistics */
            crawledTimes++;
			lastCrawl = Calendar.getInstance().getTime();

			/* wait for next tick */
			Thread.sleep(tick);
		}
		
	}

	public void addOffering(Offering offering) {
		if (offering == null)
			return;

		Discoverer discoverer = Discoverer.instance();
		discoverer.addOffering(offering);
		totalCrawledOfferings++;
	}

	@Override
	public void run() {
		try {
			if (this.crawlOnStartup == false) {
				Thread.sleep(tick);
			}

			run_helper();
		} catch(Exception ex) {
			ex.printStackTrace();
		}
		
	}
}
