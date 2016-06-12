coviu-js-sdk - COVIU API顶层javascript客户端库
==============================================================


COVIU提供了一个基于会话形式来创建，和限制进入COVIU通话。使用的典型情况如下：

* 会话：是指COVIU通话在指定的时间双方或多方之间发生，并具有有时效性。
* 参会者：要加入到COVIU通话的用户。

参会者在自己的浏览器或移动应用程序中的一个 _session link_ （绘画链接）加入通话。该 _session link_ 确认参会者，包括姓名，可选头像，以及重要的是他们 _role_ (用户角色）。因此，每一个加入COVIU通话的用户都会被分配一个不同的 _session link_ ，也就是说 _session link_ 被创建是根据 _participant_ 属性。每个参与者的角色属性 _role_ 标示着该用户连接的权限，直连或间接连接 _let in_ 。 _let in_ 模式是指新加入通话用户需要被准许。

coviu-js-sdk 通过方便的JS库公开这些功能.


### 安装

```bash
npm install --save coviu-js-sdk
```


### 快速开始

在使用SDK的时候需要传递您的API密钥组

```javascript
var sdk = require('coviu-js-sdk');

var apiKey = 'my_api_key_from_coviu.com';
var keySecret = 'my_api_key_secret';

var coviu = sdk(apiKey, keySecret);
```

安排会话。

```javascript

var session =  {
  session_name: "A test session with Dr. Who",
  start_time: 'Wed, 08 Jun 2016 13:34:00 GMT',
  end_time: 'Wed, 08 Jun 2016 13:44:00 GMT',
  picture: 'http://www.fillmurray.com/200/300',
  participants: []
};

coviu.sessions.createSession(session).run().then(console.log);
```

成功回复
```javascript
{
  team_id: '936c863f-ccff-4775-9011-cd17f4b5ad75',
  client_id: '07c0fdbd-9089-4943-aa0b-2b01754f42e7',
  participants: [],
  session_id: '09ef6778-3714-4dd6-91ec-d2868365c4ef',
  session_name: 'A test session with Dr. Who',
  start_time: 'Wed, 08 Jun 2016 13:34:00 GMT',
  end_time: 'Wed, 08 Jun 2016 13:44:00 GMT',
  picture: 'http://www.fillmurray.com/200/300'
}
```

`coviu.sessions.*` 是该建立API请求的功能集合。每一个API请求在`.run()`之后才会执行，并回复是强制性。
注意：开始时间start_time和结束时间end_time是RFC-1123的字符格式并要转成UTC时间。

添加一个参与者的会话
```javascript
var host = {
  display_name: "Dr. Who",
  role: "host", // or "guest"
  picture: "http://fillmurray.com/200/300",
  state: "test-state"
};
var sessionId = '09ef6778-3714-4dd6-91ec-d2868365c4ef';
api.sessions.addParticipant(sessionId, host).run().then(console.log);
```

成功回复
```javascript
{
  client_id: '07c0fdbd-9089-4943-aa0b-2b01754f42e7',
  display_name: 'Dr. Who',
  entry_url: 'https://coviu.com/session/e3c40e88-2b19-49bd-b687-1c08e4e0e124',
  participant_id: 'e3c40e88-2b19-49bd-b687-1c08e4e0e124',
  picture: 'http://fillmurray.com/200/300',
  role: 'HOST',
  session_id: '09ef6778-3714-4dd6-91ec-d2868365c4ef',
  state: 'test-state'
}
```

注意：`entry_url`是新创建参会者进入会话的入口。该url可以用在浏览器或在coviu移动端。参会者必须在起始时间
`start_time` 与结束时间 `end_time` (在这段时间，该会话才有效), 才能进入该会话。


读出整个会话结构
```javascript
api.sessions.getSession('09ef6778-3714-4dd6-91ec-d2868365c4ef').run().then(console.log).catch(console.error);
```

成功回复
```javascript
{
  team_id: '936c863f-ccff-4775-9011-cd17f4b5ad75',
  client_id: '07c0fdbd-9089-4943-aa0b-2b01754f42e7',
  session_id: '09ef6778-3714-4dd6-91ec-d2868365c4ef',
  session_name: 'A test session with Dr. Who',
  start_time: 'Wed, 08 Jun 2016 13:35:44 GMT',
  end_time: 'Wed, 08 Jun 2016 13:45:44 GMT',
  picture: 'http://www.fillmurray.com/200/300',
  participants:[{
    client_id: '07c0fdbd-9089-4943-aa0b-2b01754f42e7',
    display_name: 'Dr. Who',
    entry_url: 'https://coviu.com/session/e3c40e88-2b19-49bd-b687-1c08e4e0e124',
    participant_id: 'e3c40e88-2b19-49bd-b687-1c08e4e0e124',
    picture: 'http://fillmurray.com/200/300',
    role: 'HOST',
    session_id: '09ef6778-3714-4dd6-91ec-d2868365c4ef',
    state: 'test-state'
  }]
}
```

有提供全套API文档 `coviu-sdk-api` 位于npm链接
https://github.com/coviu/coviu-sdk-api/blob/master/libs/sessions.js
