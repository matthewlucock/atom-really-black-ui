'use strict'

functions.add('pure-customizable-variable', function (argument) {
  const variableName = argument.value
  const variable = new tree.Variable(`@${variableName}`)
  const variableOutput = {
    value: '',
    add (output) {this.value += output}
  }

  variable.eval(this.context).genCSS(this.context, variableOutput)

  return new tree.Keyword(
    `var(--pure-${variableName}, ${variableOutput.value})`
  )
})
