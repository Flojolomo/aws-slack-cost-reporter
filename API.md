# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### CostNotificationSlackBot <a name="CostNotificationSlackBot" id="aws-slack-cost-notification-bot.CostNotificationSlackBot"></a>

#### Initializers <a name="Initializers" id="aws-slack-cost-notification-bot.CostNotificationSlackBot.Initializer"></a>

```typescript
import { CostNotificationSlackBot } from 'aws-slack-cost-notification-bot'

new CostNotificationSlackBot(scope: Construct, id: string, props: CostNotificationSlackBotProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#aws-slack-cost-notification-bot.CostNotificationSlackBot.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#aws-slack-cost-notification-bot.CostNotificationSlackBot.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#aws-slack-cost-notification-bot.CostNotificationSlackBot.Initializer.parameter.props">props</a></code> | <code><a href="#aws-slack-cost-notification-bot.CostNotificationSlackBotProps">CostNotificationSlackBotProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="aws-slack-cost-notification-bot.CostNotificationSlackBot.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="aws-slack-cost-notification-bot.CostNotificationSlackBot.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="aws-slack-cost-notification-bot.CostNotificationSlackBot.Initializer.parameter.props"></a>

- *Type:* <a href="#aws-slack-cost-notification-bot.CostNotificationSlackBotProps">CostNotificationSlackBotProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#aws-slack-cost-notification-bot.CostNotificationSlackBot.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="aws-slack-cost-notification-bot.CostNotificationSlackBot.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#aws-slack-cost-notification-bot.CostNotificationSlackBot.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="aws-slack-cost-notification-bot.CostNotificationSlackBot.isConstruct"></a>

```typescript
import { CostNotificationSlackBot } from 'aws-slack-cost-notification-bot'

CostNotificationSlackBot.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="aws-slack-cost-notification-bot.CostNotificationSlackBot.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#aws-slack-cost-notification-bot.CostNotificationSlackBot.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |

---

##### `node`<sup>Required</sup> <a name="node" id="aws-slack-cost-notification-bot.CostNotificationSlackBot.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---


## Structs <a name="Structs" id="Structs"></a>

### CostNotificationSlackBotProps <a name="CostNotificationSlackBotProps" id="aws-slack-cost-notification-bot.CostNotificationSlackBotProps"></a>

#### Initializer <a name="Initializer" id="aws-slack-cost-notification-bot.CostNotificationSlackBotProps.Initializer"></a>

```typescript
import { CostNotificationSlackBotProps } from 'aws-slack-cost-notification-bot'

const costNotificationSlackBotProps: CostNotificationSlackBotProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#aws-slack-cost-notification-bot.CostNotificationSlackBotProps.property.slackChannelId">slackChannelId</a></code> | <code>string</code> | *No description.* |
| <code><a href="#aws-slack-cost-notification-bot.CostNotificationSlackBotProps.property.slackWorkspaceId">slackWorkspaceId</a></code> | <code>string</code> | *No description.* |
| <code><a href="#aws-slack-cost-notification-bot.CostNotificationSlackBotProps.property.guardRailPolicies">guardRailPolicies</a></code> | <code>aws-cdk-lib.aws_iam.IManagedPolicy[]</code> | *No description.* |
| <code><a href="#aws-slack-cost-notification-bot.CostNotificationSlackBotProps.property.notificationSchedule">notificationSchedule</a></code> | <code>aws-cdk-lib.aws_events.Schedule</code> | *No description.* |
| <code><a href="#aws-slack-cost-notification-bot.CostNotificationSlackBotProps.property.topic">topic</a></code> | <code>aws-cdk-lib.aws_sns.ITopic</code> | *No description.* |

---

##### `slackChannelId`<sup>Required</sup> <a name="slackChannelId" id="aws-slack-cost-notification-bot.CostNotificationSlackBotProps.property.slackChannelId"></a>

```typescript
public readonly slackChannelId: string;
```

- *Type:* string

---

##### `slackWorkspaceId`<sup>Required</sup> <a name="slackWorkspaceId" id="aws-slack-cost-notification-bot.CostNotificationSlackBotProps.property.slackWorkspaceId"></a>

```typescript
public readonly slackWorkspaceId: string;
```

- *Type:* string

---

##### `guardRailPolicies`<sup>Optional</sup> <a name="guardRailPolicies" id="aws-slack-cost-notification-bot.CostNotificationSlackBotProps.property.guardRailPolicies"></a>

```typescript
public readonly guardRailPolicies: IManagedPolicy[];
```

- *Type:* aws-cdk-lib.aws_iam.IManagedPolicy[]

---

##### `notificationSchedule`<sup>Optional</sup> <a name="notificationSchedule" id="aws-slack-cost-notification-bot.CostNotificationSlackBotProps.property.notificationSchedule"></a>

```typescript
public readonly notificationSchedule: Schedule;
```

- *Type:* aws-cdk-lib.aws_events.Schedule

---

##### `topic`<sup>Optional</sup> <a name="topic" id="aws-slack-cost-notification-bot.CostNotificationSlackBotProps.property.topic"></a>

```typescript
public readonly topic: ITopic;
```

- *Type:* aws-cdk-lib.aws_sns.ITopic

---



