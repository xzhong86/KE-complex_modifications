// -*- js-indent-level: 2; -*-
// JavaScript should be written in ECMAScript 5.1.

function genKeyCode(code, modifiers) {
  var kc = { key_code: code }
  if (modifiers) {
    if (modifiers == "any")
      modifiers = { optional: ["any"] }
    kc.modifiers = modifiers
  }
  return kc
}

function genSetVar(vname, val) {
  return { set_variable: { name: vname, value: val }}
}
function genSpaceFnModeSwitch() {
  return {
    description: "SpaceFN(BruceZh): Space enables SpaceFN mode " +
      "(inspired by: https://geekhack.org/index.php?topic=51069.0)",
    manipulators: [
      {
        from: {
          key_code: "spacebar",
          modifiers: { optional: ["any"] }
        },
        to: [ genSetVar("spacefn_mode", 1) ],
        to_after_key_up: [ genSetVar("spacefn_mode", 0) ],
        to_if_alone: [{ "key_code": "spacebar" }],
        type: "basic"
      }
    ]
  }
}

function genSpaceFnMap(from_keys, to_keys) {
  const desc = "SpaceFN: map - to -"
  const genMap = function(from_key, to_key) {
    return {
      conditions: [
        {
          name: "spacefn_mode",
          type: "variable_if",
          value: 1
        }
      ],
      from: genKeyCode(from_key, "any"),
      to: [{ key_code: to_key }],
      type: "basic"
    }
  }
  const mnps = from_keys.map(function(from_key, idx){
    return genMap(from_key, to_keys[idx])
  })
  return {
    description: desc,
    manipulators: mnps
  }
}

function main() {
  console.log(
    JSON.stringify(
      {
        title: 'input_source_if,input_source_unless example',
        rules: [].concat(
	  genSpaceFnModeSwitch(),
	  genSpaceFnMap(["u", "k", "j", "l"], ["up_arrow", "down_arrow", "left_arrow", "right_arrow"]),
	  genSpaceFnMap(["h", "o", "u", "n"], ["home", "end", "page_up", "page_down"]),
	  genSpaceFnMap(["x", "b"], ["delete_forward", "spacebar"])
	)
      },
      null,
      '  '
    )
  )
}

main()
