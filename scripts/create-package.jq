def dev(deps):
  deps | to_entries
    | map(select(.value.dev == true))
    | map({key: .key, value: .value.version})
    | from_entries
    | reduce . as $item ({}; . + $item)
    | {devDependencies: .};

def prod(deps):
  deps | to_entries
    | map(select(.value.dev != true))
    | map({key: .key, value: .value.version})
    | from_entries
    | reduce . as $item ({}; . + $item)
    | {dependencies: .};

{name: .name, version: .version} + dev(.dependencies) + prod(.dependencies)
