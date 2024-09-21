package vue

import (
	"syscall/js"
)

type JSObject interface {
	ToJS() js.Value
}

type SetupContext map[string]interface{}

func (s SetupContext) ToJS() js.Value {
    jsObjects := js.ValueOf(map[string]interface{}{})
    for n, v := range s {
      var object js.Value
      switch v := v.(type) {
      case JSObject:
        object = v.ToJS()
      default:
        object = js.ValueOf(v)
      }
      jsObjects.Set(n, object)
    }

    return jsObjects
}
