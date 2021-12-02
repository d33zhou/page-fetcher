// Page Downloader
// take 2 CLArgs, download the resource at the URL to the local path on the machine

const args = process.argv.slice(2); // URL and a local file path

const request = require('request');                           // for HTTP requests
const fs = require('fs');                                     // for file reading/writing

const readline = require('readline');                         // for user input
const { stdin: input, stdout: output } = require('process');  // for user input

const url = args[0];
const localFile = args[1];

const rl = readline.createInterface({ input, output});

// send HTTP request
request(url, (error, response, body) => {
  if (error) {
    console.log("Error: invalid URL");
    rl.close();
    return;
  }

  // read file to see if data already exists
  fs.readFile(localFile, 'utf8', (err, data) => {
    if (err) {
      console.log("Error: No such file or directory.");
      rl.close();
      return;
    }

    // prompt user to overwrite if any data exists in target file
    if (data.length > 0) {
      rl.question(`${data.length} bytes of data currently exists in the local file. Enter Y to overwrite. `, answer => {
        if (answer === "Y") {
          console.log("Data will be overwritten. Writing to file...");
          rl.close();
          
          // write results from HTTP request to file
          fs.writeFile(localFile, body, err => {
            if (err) {
              console.log(err);
              return;
            }

            // print successful write message
            console.log(`Downloaded and saved ${body.length} bytes to ${localFile}`);
          });

        } else {
          console.log("Data will not be overwritten. Aborting...");
          rl.close();
          
          return;
        }
      });
    } else if (data.length === 0) {
      
      // write results from HTTP request to file
      fs.writeFile(localFile, body, err => {
        if (err) {
          console.log(err);
          return;
        }
        rl.close(); // why is this needed if not calling the rl function?

        // print successful write message
        console.log(`Downloaded and saved ${body.length} bytes to ${localFile}`);
      });
    }
  });
});