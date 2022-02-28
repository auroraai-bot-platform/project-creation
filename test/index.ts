import { assert } from 'chai';
import { describe, it } from 'mocha';
import { createProjects } from '../src/index';
import {LambdaRequest} from '../src/index';

const token = process.env.REST_API_TOKEN || 'TEST_TOKEN';

describe('test lambda handler', function() {
  it('should create a project and return 200 ok', async function() {

    const requestData: LambdaRequest = {
      'tokenSecretArn':'arn:aws:secretsmanager:eu-north-1:530123621479:secret:test.ecsbase.graphql-apikey-WApU9d',
      'botfrontBaseUrl': 'http://localhost:3030',
      'projects':[{'name':'testbot','nameSpace':'bf-testbot','projectId':'testbot','host':'http://rasa-testbot.testservice.internal:5008','baseUrl':'https://test.aaibot.link:5008','actionEndpoint':'http://action-testbot.testservice.internal:5058','hasProd':true,'prodBaseUrl':'https://test.aaibot.link:10008','prodActionEndpoint':'http://action-testbot.testservice.internal:5058'},{'name':'palmu','nameSpace':'bf-palmu','projectId':'palmu','host':'http://rasa-palmu.testservice.internal:5009','baseUrl':'https://test.aaibot.link:5009','actionEndpoint':'http://action-palmu.testservice.internal:5059','prodBaseUrl':'https://test.aaibot.link:undefined','prodActionEndpoint':'http://action-palmu.testservice.internal:5059'}]
    };

    const result = await createProjects(requestData);

    if (!result) {
      assert.fail('No lambda response');
    }
    assert.strictEqual(result.StatusCode, 200);
  });
});