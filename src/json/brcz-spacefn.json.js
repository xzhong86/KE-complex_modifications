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
    description: "SpaceFN: Mode switch " +
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
  const str_f = from_keys.join("/")
  const str_t = to_keys.join("/")
  //const desc  = `SpaceFN: map ${str_f} to ${str_t}`
  const desc  = ["SpaceFN: map ", str_f, " to ", str_t].join("")
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

function makeArray(len, content) {
  var result = [];
  if(typeof content == "function") {
    for(var i = 0; i < len; i++) {
      result.push(content(i));
    }
  } else {
    for(var i = 0; i < len; i++) {
      result.push(content);
    }
  }
  return result;
}

function numSeq(start, len, pfx) {
  //const seq = Array(len).fill().map((_,i) => start + i)
  //return seq.map((e, _) => pfx + e)
  //const seq = Array(len).fill().map(function(_,i){ return start + i })
  const seq = makeArray(len, function(i){ return start + i })
  return seq.map(function(e, _){ return pfx + e })
}

function main() {
  console.log(
    JSON.stringify(
      {
        title: 'SpaceFn(BruceZh): use spacebar as Fn, by BruceZh.',
	author: "Bruce Zhong (https://github.com/xzhong86)",
        rules: [].concat(
	  genSpaceFnModeSwitch(),
	  genSpaceFnMap(["i", "k", "j", "l"], ["up_arrow", "down_arrow", "left_arrow", "right_arrow"]),
	  genSpaceFnMap(["h", "o", "u", "n"], ["home", "end", "page_up", "page_down"]),
	  genSpaceFnMap(["x", "b"], ["delete_forward", "spacebar"]),
	  genSpaceFnMap(numSeq(1, 9, "").concat("0"), numSeq(1, 10, "f")),
	  genSpaceFnMap(["hyphen", "equal_sign"], ["f11", "f12"])
	)
      },
      null,
      '  '
    )
  )
}

main()
