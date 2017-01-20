# Commands.js

## Adding commands

All commands should be added in the `commands.js` file.

The key in the commands.js should be the name of the command. To name your command `super-command`, add the following to `commands.js`.
```
// in commands.js
module.exports = {
  'super-command': {}
  ...
};
```

If the new command is complex move it to it's own file in the `/commands` directory and require it in.

```
// in commands.js
module.exports = {
  'my-new-command': require('./commands/my-new-command'),
  ...
};
```

## Adding subcommands

You may add as many layers of subcommands as you'd like. The subcommands should be attached to the `commands` key on the top-level command.

You would run the `sub-command` as follows: `sparkpost category sub-command`.

```
// in commands.js
module.exports = {
 'category': {
    commands: {
      'sub-command': {
        action: function(callback) {
          console.log('You called a subcommand');
        }
      }
    }
  } 
}
```


## Options

Options should be added on the options key of your command. Any options not added through this object will not get passed into the `action` function. For more valid keys see the [yargs docs](https://github.com/yargs/yargs#optionskey-opt).

````
'my-command': {
  options: {
    name: {
      type: 'string',
      describe: 'Your full name',
      demand: true
    }
  }
}
````

## Hooks
There are 3 hooks in each command: `map`, `action`, and `callback`.

### `map`

The `map` hook allows you to modify the array of values to be passed to the `action` hook. It takes 3 arguments, the option keys, the option values, and the original `argv` object. The keys and values will be in the order the options were listed. If no value was given to the option then it will be `null`. It should return the modified array of values.

```
'my-command': {
  map: function(keys, values, argv) {
    // passing through the original argv to the action

    return [argv];
  }
}
```


### `action`

The `action` hook allows you define the function to be called with the given values. The last parameter will always be the function from the `callback` hook. At the end of the action, it should invoke the callback.

```
'order-pizza': {
  options: {
  	size: {
  		type: 'string',
  		default: 'large',
  		choices: ['small', 'medium', 'large']
    },
    pepperoni: {
      type: 'boolean'
    },
    'extra-cheese': {
      type: 'boolean'
    }
  },
  action: function(size, pepperoni, extraCheese, callback) {
  	let theOrder = {
  	   size: size,
  	   toppings: []
  	};

  	if (pepperoni)
      theOrder.toppings.push('pepperoni');

  	if (extraCheese)
      theOrder.toppings.push('extra cheese');

  	if (!pepperoni && !extraCheese)
      theOrder.toppings.push('no toppings');  	

  	callback(null, theOrder);
  } 
}
```

### `callback`

The `callback` hooks allows you to replace the function that the action invokes. It gets passed two values, `error` and `results`. If successful, `error` will be a falsey value.
To continue with our pizza example.
```
'order-pizza': {
	...
	callback: function(error, order) {
		if (error) {
			console.log('We hit a problem ');
			return;
		}
		// place the order

		console.log(`We received your order for a ${order.size} pizza with ${order.toppings.join(' and ')}`)

	}
}
```


## Using handler

You should avoid overriding the handler function for your command. The default handler does a few key things on your behalf including calling the hooks, handling invalid subcommand calls, and parsing out the given options.

If you do override it, make sure you do not lose the functionality for the subcommands.


Note: _The CLI uses yargs under the hood. You can find the full documentation [here](https://github.com/yargs/yargs#commandmodule) if you need more granular control._