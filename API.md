# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### SlackCostReporter <a name="SlackCostReporter" id="aws-slack-cost-reporter.SlackCostReporter"></a>

The constructs sets up a chatbot sending cost reports of the current bill & the expected forecast to a slack channel based on a rate or schedule.

To use this construct, manual steps are required to be able to authorize with the AWS account.
Therefore, navigate to {@link https://us-east-2.console.aws.amazon.com/chatbot/home} and configure the slack client
corresponding to the {@link SlackCostReporterProps.slackWorkspaceId}. Right now, this is neither possible via the CLI, nor CloudFormation.
If this is not done, the deployment is going to fail with the error message
"Invalid request provided: AWS Chatbot can't create the configuration because Slack workspace *** is not authorized with AWS account ***".

#### Initializers <a name="Initializers" id="aws-slack-cost-reporter.SlackCostReporter.Initializer"></a>

```typescript
import { SlackCostReporter } from 'aws-slack-cost-reporter'

new SlackCostReporter(scope: Construct, id: string, props: SlackCostReporterProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#aws-slack-cost-reporter.SlackCostReporter.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#aws-slack-cost-reporter.SlackCostReporter.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#aws-slack-cost-reporter.SlackCostReporter.Initializer.parameter.props">props</a></code> | <code><a href="#aws-slack-cost-reporter.SlackCostReporterProps">SlackCostReporterProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="aws-slack-cost-reporter.SlackCostReporter.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="aws-slack-cost-reporter.SlackCostReporter.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="aws-slack-cost-reporter.SlackCostReporter.Initializer.parameter.props"></a>

- *Type:* <a href="#aws-slack-cost-reporter.SlackCostReporterProps">SlackCostReporterProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#aws-slack-cost-reporter.SlackCostReporter.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="aws-slack-cost-reporter.SlackCostReporter.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#aws-slack-cost-reporter.SlackCostReporter.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="aws-slack-cost-reporter.SlackCostReporter.isConstruct"></a>

```typescript
import { SlackCostReporter } from 'aws-slack-cost-reporter'

SlackCostReporter.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="aws-slack-cost-reporter.SlackCostReporter.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#aws-slack-cost-reporter.SlackCostReporter.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |

---

##### `node`<sup>Required</sup> <a name="node" id="aws-slack-cost-reporter.SlackCostReporter.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---


## Structs <a name="Structs" id="Structs"></a>

### SlackCostReporterProps <a name="SlackCostReporterProps" id="aws-slack-cost-reporter.SlackCostReporterProps"></a>

Configuration of an the {@link SlackCostReporter} instance.

#### Initializer <a name="Initializer" id="aws-slack-cost-reporter.SlackCostReporterProps.Initializer"></a>

```typescript
import { SlackCostReporterProps } from 'aws-slack-cost-reporter'

const slackCostReporterProps: SlackCostReporterProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#aws-slack-cost-reporter.SlackCostReporterProps.property.slackChannelId">slackChannelId</a></code> | <code>string</code> | Channel ID of the slack channel to send the reports. |
| <code><a href="#aws-slack-cost-reporter.SlackCostReporterProps.property.slackWorkspaceId">slackWorkspaceId</a></code> | <code>string</code> | ID of the slack workspace. |
| <code><a href="#aws-slack-cost-reporter.SlackCostReporterProps.property.guardRailPolicies">guardRailPolicies</a></code> | <code>aws-cdk-lib.aws_iam.IManagedPolicy[]</code> | Guardrails applied to the permissions of the chatbot. |
| <code><a href="#aws-slack-cost-reporter.SlackCostReporterProps.property.schedule">schedule</a></code> | <code>aws-cdk-lib.aws_events.Schedule</code> | Schedule  or rate at which cost reports are generated and sent to the slack channel. |
| <code><a href="#aws-slack-cost-reporter.SlackCostReporterProps.property.topic">topic</a></code> | <code>aws-cdk-lib.aws_sns.ITopic</code> | Topic used as to notify the slack bot. |

---

##### `slackChannelId`<sup>Required</sup> <a name="slackChannelId" id="aws-slack-cost-reporter.SlackCostReporterProps.property.slackChannelId"></a>

```typescript
public readonly slackChannelId: string;
```

- *Type:* string

Channel ID of the slack channel to send the reports.

---

##### `slackWorkspaceId`<sup>Required</sup> <a name="slackWorkspaceId" id="aws-slack-cost-reporter.SlackCostReporterProps.property.slackWorkspaceId"></a>

```typescript
public readonly slackWorkspaceId: string;
```

- *Type:* string

ID of the slack workspace.

It is crucial, that a client
is set up & authenticated for this ID.

---

##### `guardRailPolicies`<sup>Optional</sup> <a name="guardRailPolicies" id="aws-slack-cost-reporter.SlackCostReporterProps.property.guardRailPolicies"></a>

```typescript
public readonly guardRailPolicies: IManagedPolicy[];
```

- *Type:* aws-cdk-lib.aws_iam.IManagedPolicy[]
- *Default:* None

Guardrails applied to the permissions of the chatbot.

If not set
the chatbot has no permission for any operation.

---

##### `schedule`<sup>Optional</sup> <a name="schedule" id="aws-slack-cost-reporter.SlackCostReporterProps.property.schedule"></a>

```typescript
public readonly schedule: Schedule;
```

- *Type:* aws-cdk-lib.aws_events.Schedule
- *Default:* None

Schedule  or rate at which cost reports are generated and sent to the slack channel.

If not set the report is creates every day at 8 AM UTC.

---

##### `topic`<sup>Optional</sup> <a name="topic" id="aws-slack-cost-reporter.SlackCostReporterProps.property.topic"></a>

```typescript
public readonly topic: ITopic;
```

- *Type:* aws-cdk-lib.aws_sns.ITopic
- *Default:* None

Topic used as to notify the slack bot.

If not set, a new topic
is created.

---



