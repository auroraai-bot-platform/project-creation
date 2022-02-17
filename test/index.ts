import { assert } from 'chai';
import { describe, it } from 'mocha';
import { createProjects } from '../src/index';
import {LambdaRequest} from '../src/index';

const token = process.env.REST_API_TOKEN || 'TEST_TOKEN';

describe('test lambda handler', function() {
  it('should create a project and return 200 ok', async function() {

    const requestData: LambdaRequest = {
      botfrontBaseUrl: 'http://localhost:3030',
      projects: [
        {
          baseUrl: 'http://rasa-demo-1.demoservice.internal:5006',
          name: 'demo-1',
          nameSpace: 'bf-demo-1',
          projectId: 'hH4Z8S7GXiHsp3PTP'
        },
        {
          baseUrl: 'http://rasa-palmu-demo.demoservice.internal:5007',
          name: 'palmu-demo',
          nameSpace: 'bf-palmu-demo',
          projectId: 'C6y53duQKrDhBqFRp'
        }
      ]
    };

    const result = await createProjects(requestData);
    console.log({result});
    if (!result) {
      assert.fail('No lambda response');
    }
    assert.strictEqual(result.statusCode, 200);
  });
});