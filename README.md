<a href="https://www.sparkpost.com"><img src="https://www.sparkpost.com/sites/default/files/attachments/SparkPost_Logo_2-Color_Gray-Orange_RGB.svg" width="200px"/></a>

[Sign up][sparkpost sign up] for a SparkPost account and visit our [Developer Hub](https://developers.sparkpost.com) for even more content.

# SparkPost Command Line Interface

A command-line interface to SparkPost.


## Installation

The easiest way to install the CLI is through npm.

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
To start using the CLI you have to give it an API key associated with your account. You can specify your API key through the environment variable `SPARKPOST_API_KEY` or the `config` command.

```
// using an env variable
export SPARKPOST_API_KEY=MY_SPARKPOST_API_KEY
// using the CLI
sparkpost config --key=MY_SPARKPOST_API_KEY
```


## Getting Help

### `--help`
Use the `--help` flag on any command to get information about any subcommands and options it takes.

```
sparkpost inbound-domains --help
```
```
Usage: sparkpost inbound-domains <command> [options]

Commands:
  create  create a inbound domain
  delete  delete a inbound domain
  get     get a inbound domain
  list    list inbound domains

Options:
  --version  Show version number  [boolean]
  --help     Show help  [boolean]
  --docs     Open documentation  [boolean]
```

### `--docs`
On any of the endpoint commands you can use the `--docs` flag to open up the full documentation in your browser.

```
sparkpost sending-domains --docs
```


## Basic Commands
For a full list of commands run `sparkpost --help`.

* `sparkpost config` - Configure the CLI to your account
* `sparkpost account` - Get your account information
* `sparkpost [endpoint] [command]` - Call the specified endpoint and command <br>Supported endpoints include: `inbound-domains`, `message-events`, `relay-webhooks`, `sending-domains`, `subaccounts`, `webhooks`


## Tips
* Using an elite account? Set `sparkpost config --origin=YOUR_ORIGIN` to use the CLI.
* Note: this tool is still young. To migrate your suppression list from SendGrid or Mandrill, please use our other [CLI tool](https://github.com/SparkPost/sparkpost-cli). PRs welcome :)


# Contributing

We love community contributions. Checkout [CONTRIBUTING.md](https://github.com/SparkPost/node-sparkpost-cli/blob/master/CONTRIBUTING.md) and [COMMANDS.md](https://github.com/SparkPost/node-sparkpost-cli/blob/master/COMMANDS.md) for guides on adding to the CLI. 

[sparkpost sign up]: https://app.sparkpost.com/sign-up