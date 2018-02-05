'use-strict'

const AWS = require('aws-sdk');

/**
This node.js Lambda function is attached as a rule engine action to the registration topic 
Saws/events/certificates/registered/<caCertificateID>.

It does the following:
- activate certificate
- assumes provisioning is done on CA cert
**/

// Incoming event
// {
//  "certificateId": "<certificateID>",
//  "caCertificateId": "<caCertificateId>",
//  "timestamp": "<timestamp>",
//  "certificateStatus": "PENDING_ACTIVATION",
//  "awsAccountId": "<awsAccountId>",
//  "certificateRegistrationTimestamp": "<certificateRegistrationTimestamp>"
//}
exports.handler = function(event, context, callback) {
  console.log(`Handling certificate activation for ${JSON.stringify(event)}`);

  const thingGroupName = process.env.ThingGroupName;
  const CertificateId = event.certificateId.toString().trim();
  const uparams = {
    CertificateId,
    newStatus: 'ACTIVE'
  };

  const Iot = new AWS.Iot();
  Iot.updateCertificate(uparams).promise()
    .then((res) => {
      console.log('Certificate updated');

      const dparams = {
        CertificateId
      };

      return Iot.describeCertificate(dparams).promise();
    })
    .then((res) => {
      console.log(res);

      const tparams = {
        thingGroupName
      };
      iot.listThingsInThingGroup(tparams)
    })
    .then((res) => {
      console.log(res);
      return callback(null, `Success, activated the certificate ${certificateId}`);
    })
    .catch((err) => {
      console.log(err);
      return callback(err);
    }); 
}