// import { IdxDataSet } from "./idxDataSet.js";
importScripts("./modules/idxConverter/idxDataSet.js");
/**
 * Converts
 * @param {String} fileURL URL of the idx dataset file
 *
 * @returns {Promise} Returns a promise, which results in the processed data as an IdxDataSet object
 *
 * @async Needs to wait for the XMLHttpRequest to load the file before parsing and returning the data
 */
async function convertIdx(fileURL) {
  console.log(`Creating dataset from ${fileURL}...`);
  return new Promise((resolve) => {
    // Create request
    let file = new XMLHttpRequest();
    // What happens once the request completes
    file.addEventListener("load", () => {
      console.log(`Dataset ${fileURL} ready`);
      return resolve(new IdxDataSet(file.response));
    });
    // Requests for the file
    file.responseType = "arraybuffer";

    // Sets the request method and request URL
    file.open("GET", fileURL);

    // Initiates the request
    file.send();
  });
}
// export {convertIdx};