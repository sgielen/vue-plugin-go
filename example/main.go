package main

import (
  "syscall/js"
)

func main() {
  // TODO: we can't use global function registration forever, but for now, let's
  js.Global().Set("MyComponentSetup", js.FuncOf(func(this js.Value, args []js.Value) any {
    return setup().ToJS()
  }))

  select {}
}
