const aws = require("aws-sdk");

let dynamoDBClientParams = {};

if (process.env.IS_OFFLINE) {
    dynamoDBClientParams = {
        region: 'localhost',
        endpoint: 'http://localhost:8000'
    };
}


const dynamodb = new aws.DynamoDB.DocumentClient(dynamoDBClientParams);

const updateUsers = async (event, context) => {
    let userId = event.pathParameters.id;
    let userBody = JSON.parse(event.body);


    const params = {
      TableName: 'usersTable',
      Key: {pk: userId},
      UpdateExpression: 'set #name = :name, #phone = :phone',
      ExpressionAttributeNames: {'#name': 'name', "#phone": 'phone'},
      ExpressionAttributeValues: {':name': userBody.name, ':phone': userBody.phone},
      ReturnValues: 'ALL_NEW',
    };

    return dynamodb.update(params).promise()
        .then(res => { 
            return {
                "statusCode": 200,
                "body": JSON.stringify({'user': res.Attributes})
            }
        })
        .catch(error => console.log(error));
}

module.exports = {
    updateUsers
};
