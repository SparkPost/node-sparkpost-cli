<a href="https://www.sparkpost.com"><img src="https://www.sparkpost.com/sites/default/files/attachments/SparkPost_Logo_2-Color_Gray-Orange_RGB.svg" width="200px"/></a>

[Sign up][sparkpost sign up] for a SparkPost account and visit our [Developer Hub](https://developers.sparkpost.com) for even more content.

# SparkPost Command Line Interface

Interact with the SparkPost API from the command line.


## Installation

The easiest way to install the cli is through npm.

```
npm install sparkpost-cli -g
```

You can also clone the github repo and use a symlink.

```
git clone https://github.com/SparkPost/node-sparkpost-cli.git
cd ./node-sparkpost-cli
npm link
```


## Configuring
To start using the cli you have to give it an API key associated with your account. You can specify your API key through the environment variable `SPARKPOST_API_KEY` or the `config` command.

```
sparkpost config --key=MY_SPARKPOST_API_KEY
```


## Tips

* To open up the docs for an endpoint use the `--docs` flag. For example, `sparkpost inbound-domains --docs`.
* Using an elite account? Set `sparkpost config --origin=YOUR_ORIGIN` to use the cli.
* To migrate from mandrill or sendgrid use our other [cli tool](https://github.com/SparkPost/sparkpost-cli).


[sparkpost sign up]: https://app.sparkpost.com/sign-up