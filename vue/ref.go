package vue

import (
	"fmt"
	"reflect"
	"syscall/js"
)

type SupportedRefTypes interface {
	bool | float64 | int | string
}

type VueRef[T SupportedRefTypes] struct {
	js js.Value
}

var _ JSObject = (*VueRef[string])(nil)

func Ref[T SupportedRefTypes](v T) VueRef[T] {
	return VueRef[T]{
		js: getVue().Call("ref", v),
	}
}

func (ref *VueRef[T]) Set(v T) {
	ref.js.Set("value", v)
}

func (ref *VueRef[T]) Get() T {
	js := ref.js.Get("value")

	// TODO: don't use reflection to turn this JS type into a Golang type
	var t T
	var res any
	v := reflect.ValueOf(t)
	switch v.Kind() {
	case reflect.Bool:
		res = js.Bool()
	case reflect.String:
		res = js.String()
	default:
		panic(fmt.Sprintf("don't know how to turn js type %s into Go type %T", js.Type().String(), t))
	}
	return res.(T)
}

func (ref VueRef[T]) ToJS() js.Value {
	return ref.js
}
