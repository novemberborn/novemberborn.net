# Buoyant

Buoyant's goal is to make it easier to build distributed systems that fit your
needs.

Servers in distributed systems need to agree with each other on their state.
Buoyant implements the [Raft Consensus Algorithm](https://raft.github.io), a
relatively understandable algorithm for ensuring all servers agree on their
state. This allows you to build a reliable, distributed system that fits your
needs. You get to decide how state is stored and how servers communicate with
each other. Eventually plugins will be available to make this even easier.

Learn more in [Buoyant's GitHub
repository](https://github.com/novemberborn/buoyant). You could also [watch the
talk](https://skillsmatter.com/skillscasts/7889-distributed-consensus-using-raft-node-and-fuzz-testing)
I gave about Buoyant and fuzz testing at FullStack 2016, or [get the
slides](https://speakerdeck.com/novemberborn/distributed-consensus-using-raft-node-dot-js-and-fuzz-testing).
