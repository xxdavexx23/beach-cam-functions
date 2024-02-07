/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import axios from "axios";
// Start writing functions
// https://firebase.google.com/docs/functions/typescript

/**
 * Fetches a webpage and extracts a token from the HTML.
 * @param {functions.https.Request} req - The HTTP request object.
 * @param {functions.Response} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves
 *  when the function is complete.
 */
export const getSource = onRequest(async (req, res) => {
  // Enable CORS by setting the Access-Control-Allow-Origin header
  res.set("Access-Control-Allow-Origin", "*");
  if (req.method !== "GET") {
    res.status(405).send("Method Not Allowed");
    return;
  }
  const webpageUrl: any = req.query.url;


  try {
    // Fetch the webpage content
    const response = await axios.get(webpageUrl);
    const webpageContent = response.data;

    // Use a regular expression to extract the token
    const sourceUrlMatch = webpageContent.match(/source: '([^']+)'/);
    if (sourceUrlMatch) {
      const sourceUrl = sourceUrlMatch[1];

      // Send the token in the response
      res.status(200).json({sourceUrl});
    } else {
      res.status(404).send("Source URL not found");
    }
  } catch (error) {
    // Log the error
    logger.error("Error fetching webpage:", error);
    res.status(500).send("Error fetching webpage");
  }
});
