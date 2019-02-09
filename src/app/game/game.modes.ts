export let modes = {
  4:{
    bystanders:2,
    leaders:1,
    thugs:1,
    specialists:0,
    mobsters:0
  },
  5:{
    bystanders:3,
    leaders:1,
    thugs:1,
    specialists:0,
    mobsters:0
  },
  6:{
    bystanders:4,
    leaders:1,
    thugs:1,
    specialists:0,
    mobsters:0
  },
  7: {
    bystanders:4,
    leaders:1,
    thugs:2,
    specialists:0,
    mobsters:0
  },
  8:{
    bystanders:4,
    leaders:1,
    specialists:1,
    thugs:2,
    mobsters:0
  },
  9:{
    bystanders:5,
    leaders:1,
    specialists:1,
    thugs:2,
    mobsters:0
  },
  10:{
    bystanders:4,
    specialists:2,
    leaders:1,
    thugs:2,
    mobsters:1
  },
  11:{
    bystanders:6,
    specialists:1,
    leaders:1,
    thugs:2,
    mobsters:1
  },
  12:{
    bystanders:6,
    specialists:2,
    leaders:1,
    thugs:2,
    mobsters:1
  },
  13:{
    bystanders:6,
    specialists:2,
    leaders:1,
    thugs:3,
    mobsters:1
  },
  14:{
    bystanders:7,
    specialists:2,
    leaders:1,
    thugs:3,
    mobsters:1
  },
  15:{
    bystanders:8,
    specialists:2,
    leaders:1,
    thugs:3,
    mobsters:1
  },
  16:{
    bystanders:8,
    specialists:3,
    leaders:1,
    thugs:2,
    mobsters:2
  }
};

export let cards = {
  priest:0,
  judge:0,
  bystanders:0,
  thugs:0,
  sheriff:0,
  vixen:0,
  detective:0,
  femmeFatale:0,
  godfather:0,
  impostor:0,
  psycho:0,
  journalist:0,
  jailer:0,
  snitch:0,
  thief:0,
  hypnotist:0,
  bodyguard:0,
  nurse:0,
  lawyer:0,
  yakuza:0
}

export let groups = {

    bystanders:[],
    specialists:['nurse', 'bodyguard', 'vixen', 'hypnotist', 'journalist'],
    leaders:['jailer', 'priest', 'detective', 'judge', 'sheriff'],
    thugs:[],
    mobsters:['thief', 'godfather', 'lawyer', 'snitch']

}

export let descriptions = {
  bystanders: `Bystanderss are common roles, with no abilities. Most civilian
  players in a game will be Bystanderss.`,
  jailer:`The Jailer may investigate a player; if the investigated player
  is in the Mafia, he is immediately put in jail. Jailed players
  cannot use their abilities, participate in Mafia killings, or
  vote during the day, but they can participate in discussions.
  At dawn, the facilitator announces the identity of the player
  in jail, as well as any previously jailed players. If the Jailer is
  eliminated, all jailed players are set free and can once again
  use their abilities. `,
  priest:`The Priest may either kill or investigate a player. If the he
  investigates, the facilitator taps the investigated player to
  awaken him; the investigated player opens his eyes to learn
  the identity of the Priest, then closes his eyes again.`,
  detective:`The Detective may either kill or investigate a player.`,
  judge:`The Judge may investigate a player. During the day, the
  Judge’s vote counts as two votes. The facilitator adds the
  extra vote to the tally, but does not reveal the identity of
  the Judge.`,
  vixen:`The Vixen may seduce a player. The seduced player cannot
  use his ability that night, but he also cannot be killed.
  The facilitator calls on the seduced player as usual
  but does not allow him to use his ability; instead, the
  facilitator holds up a hand to demonstrate the player has
  been blocked. If the Vixen seduces the only Mafia player
  remaining in the game, the Mafia does not kill anyone that night.`
  ,
  hypnotist:`The Hypnotist may hypnotize another player. During the
  following daytime vote, the hypnotized player must vote
  the same way as the Hypnotist. When the votes are counted,
  the facilitator tells the chosen player that he is hypnotized
  and toward whom his vote is counted. The facilitator does not
  reveal the identity of the Hypnotist.
  `,
  journalist:`The Journalist may research two players by pointing at
  them simultaneously. If the two researched players are on
  the same team, the facilitator nods. If they are on opposing
  teams, the facilitator shakes his head.
  `,
  sheriff:`The Sheriff may kill a player.`,
  nurse:`The Nurse may protect a player. If the protected player is
  killed during that night, he stays alive instead, and is not
  named among the victims at dawn. The killer does not learn
  that his target was protected, nor is the protected player told
  there was an attempt on his life.`,
  bodyguard:`The Bodyguard may protect a player. If the protected
  player is killed during that night, he stays alive, and the
  Bodyguard is killed instead. The killer does not learn that
  his target was protected, nor is the protected player told
  there was an attempt on his life.`,
  thief:`The Thief may block a player. The blocked player cannot
  use his ability that night. The facilitator calls on the
  blocked player as usual but does not allow him to use
  his ability; instead, the facilitator holds up a hand to
  demonstrate the player has been blocked.`,
  godfather:`The Godfather may silence a player. The silenced player
  cannot vote during the next day’s killing. At dawn, the
  facilitator announces the name of the silenced player. That
  player can still participate in the daytime discussion and
  become a suspect; however, he cannot raise his hand to vote.`,
  lawyer:`The Lawyer may investigate a player; the facilitator shows
  the investigated player’s facilitator card to the Lawyer. `,
  snitch:`The Snitch may badmouth a player. If the badmouthed
  player’s identity is investigated that night, the facilitator
  shows a Mafia Thugs facilitator card instead of the player’s
  actual facilitator card. The Snitch works best in games with
  roles that have the investigate ability.`,
  impostor:`The Impostor must pretend to be a Mafia Thugs. When the
  facilitator instructs the Mafia to awaken, the Impostor player
  must open his eyes and participate in choosing a victim
  as though he were part of the Mafia. When the facilitator
  instructs the Mafia to go to sleep, the Impostor player must
  close his eyes. The Impostor is the only player who must
  always use his ability. `

};
