import { create } from 'zustand';
import { BattleState, OPCGBattleState, PokemonBattleCard, OnePieceCard, PlayerSide, WeatherType, BattlePhase } from '@/types';

interface BattleStore {
  ptcgState: BattleState | null;
  opcgState: OPCGBattleState | null;
  currentGame: 'ptcg' | 'opcg' | 'cross' | null;
  isPlaying: boolean;

  initPTCGBattle: (playerDeck: PokemonBattleCard[], opponentDeck: PokemonBattleCard[], weather?: WeatherType) => void;
  initOPCGBattle: (playerLeader: OnePieceCard, opponentLeader: OnePieceCard) => void;
  setPhase: (phase: BattlePhase) => void;
  nextTurn: () => void;
  drawCard: (side: PlayerSide) => void;
  playCard: (cardId: string, side: PlayerSide) => void;
  attack: (attackerId: string, targetId: string) => void;
  attachEnergy: (energyType: string, pokemonId: string, side: PlayerSide) => void;
  switchActive: (benchIndex: number, side: PlayerSide) => void;
  endTurn: () => void;
  setWeather: (weather: WeatherType) => void;
  resetBattle: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

const createInitialBattleState = (): BattleState => ({
  id: generateId(),
  phase: 'draw',
  turn: 1,
  currentPlayer: 'player',
  weather: null,
  playerDeck: [],
  playerHand: [],
  playerActive: null,
  playerBench: [],
  playerPrizeCards: [],
  playerDiscard: [],
  playerEnergy: [],
  opponentDeck: [],
  opponentHand: [],
  opponentActive: null,
  opponentBench: [],
  opponentPrizeCards: [],
  opponentDiscard: [],
  opponentEnergy: [],
  playerBondCounter: 0,
  winner: null,
  gameLog: []
});

const createInitialOPCGState = (): OPCGBattleState => ({
  id: generateId(),
  turn: 1,
  currentPlayer: 'player',
  playerLeader: null,
  playerLife: 8,
  playerMaxLife: 8,
  playerHand: [],
  playerDeck: [],
  playerDiscard: [],
  playerField: [],
  playerEnergy: 0,
  playerBounty: null,
  playerHaki: false,
  opponentLeader: null,
  opponentLife: 8,
  opponentMaxLife: 8,
  opponentHand: [],
  opponentDeck: [],
  opponentDiscard: [],
  opponentField: [],
  opponentEnergy: 0,
  opponentBounty: null,
  opponentHaki: false,
  winner: null
});

export const useBattleStore = create<BattleStore>((set, get) => ({
  ptcgState: null,
  opcgState: null,
  currentGame: null,
  isPlaying: false,

  initPTCGBattle: (playerDeck, opponentDeck, weather) => {
    const state = createInitialBattleState();
    const shuffledPlayer = [...playerDeck].sort(() => Math.random() - 0.5);
    const shuffledOpponent = [...opponentDeck].sort(() => Math.random() - 0.5);

    set({
      ptcgState: {
        ...state,
        weather: weather || null,
        playerDeck: shuffledPlayer.slice(7),
        playerHand: shuffledPlayer.slice(0, 7),
        playerPrizeCards: shuffledPlayer.slice(7, 13),
        opponentDeck: shuffledOpponent.slice(7),
        opponentHand: shuffledOpponent.slice(0, 7),
        opponentPrizeCards: shuffledOpponent.slice(7, 13)
      },
      currentGame: 'ptcg',
      isPlaying: true
    });
  },

  initOPCGBattle: (playerLeader, opponentLeader) => {
    const state = createInitialOPCGState();
    set({
      opcgState: {
        ...state,
        playerLeader,
        opponentLeader
      },
      currentGame: 'opcg',
      isPlaying: true
    });
  },

  setPhase: (phase) => {
    const { ptcgState } = get();
    if (ptcgState) {
      set({ ptcgState: { ...ptcgState, phase } });
    }
  },

  nextTurn: () => {
    const { ptcgState, opcgState, currentGame } = get();
    
    if (currentGame === 'ptcg' && ptcgState) {
      const newTurn = ptcgState.turn + 1;
      const newPlayer: PlayerSide = ptcgState.currentPlayer === 'player' ? 'opponent' : 'player';
      
      set({
        ptcgState: {
          ...ptcgState,
          turn: newTurn,
          currentPlayer: newPlayer,
          phase: 'draw'
        }
      });
    } else if (currentGame === 'opcg' && opcgState) {
      const newTurn = opcgState.turn + 1;
      const newPlayer: PlayerSide = opcgState.currentPlayer === 'player' ? 'opponent' : 'player';
      
      set({
        opcgState: {
          ...opcgState,
          turn: newTurn,
          currentPlayer: newPlayer
        }
      });
    }
  },

  drawCard: (side) => {
    const { ptcgState } = get();
    if (!ptcgState) return;

    if (side === 'player') {
      if (ptcgState.playerDeck.length > 0) {
        const [drawn, ...remaining] = ptcgState.playerDeck;
        set({
          ptcgState: {
            ...ptcgState,
            playerHand: [...ptcgState.playerHand, drawn],
            playerDeck: remaining
          }
        });
      }
    } else {
      if (ptcgState.opponentDeck.length > 0) {
        const [drawn, ...remaining] = ptcgState.opponentDeck;
        set({
          ptcgState: {
            ...ptcgState,
            opponentHand: [...ptcgState.opponentHand, drawn],
            opponentDeck: remaining
          }
        });
      }
    }
  },

  playCard: (cardId, side) => {
    const { ptcgState } = get();
    if (!ptcgState) return;

    if (side === 'player') {
      const cardIndex = ptcgState.playerHand.findIndex(c => c.id === cardId);
      if (cardIndex === -1) return;

      const card = ptcgState.playerHand[cardIndex];
      const newHand = ptcgState.playerHand.filter((_, i) => i !== cardIndex);

      if (!ptcgState.playerActive) {
        set({
          ptcgState: {
            ...ptcgState,
            playerHand: newHand,
            playerActive: {
              card,
              position: 'active',
              damage: 0,
              energy: []
            }
          }
        });
      } else if (ptcgState.playerBench.length < 5) {
        set({
          ptcgState: {
            ...ptcgState,
            playerHand: newHand,
            playerBench: [
              ...ptcgState.playerBench,
              {
                card,
                position: 'bench',
                benchIndex: ptcgState.playerBench.length,
                damage: 0,
                energy: []
              }
            ]
          }
        });
      }
    } else {
      const cardIndex = ptcgState.opponentHand.findIndex(c => c.id === cardId);
      if (cardIndex === -1) return;

      const card = ptcgState.opponentHand[cardIndex];
      const newHand = ptcgState.opponentHand.filter((_, i) => i !== cardIndex);

      if (!ptcgState.opponentActive) {
        set({
          ptcgState: {
            ...ptcgState,
            opponentHand: newHand,
            opponentActive: {
              card,
              position: 'active',
              damage: 0,
              energy: []
            }
          }
        });
      } else if (ptcgState.opponentBench.length < 5) {
        set({
          ptcgState: {
            ...ptcgState,
            opponentHand: newHand,
            opponentBench: [
              ...ptcgState.opponentBench,
              {
                card,
                position: 'bench',
                benchIndex: ptcgState.opponentBench.length,
                damage: 0,
                energy: []
              }
            ]
          }
        });
      }
    }
  },

  attack: (attackerId, targetId) => {
    const { ptcgState } = get();
    if (!ptcgState) return;

    const attacker = ptcgState.playerActive?.card.id === attackerId 
      ? ptcgState.playerActive 
      : ptcgState.playerBench.find(p => p.card.id === attackerId);

    if (!attacker) return;

    const target = ptcgState.opponentActive;
    if (!target) return;

    const attack = attacker.card.attacks[0];
    if (!attack) return;

    let damage = attack.damage;
    
    if (ptcgState.playerLastAttackerId === attackerId) {
      damage += 30;
    }

    const newTargetDamage = target.damage + damage;
    
    set({
      ptcgState: {
        ...ptcgState,
        playerLastAttackerId: attackerId,
        opponentActive: {
          ...target,
          damage: newTargetDamage
        },
        gameLog: [
          ...ptcgState.gameLog,
          {
            turn: ptcgState.turn,
            player: 'player',
            action: `${attacker.card.name} 攻击 ${target.card.name}，造成 ${damage} 点伤害`,
            timestamp: new Date().toISOString()
          }
        ]
      }
    });
  },

  attachEnergy: (energyType, pokemonId, side) => {
    const { ptcgState } = get();
    if (!ptcgState) return;

    if (side === 'player') {
      if (ptcgState.playerActive?.card.id === pokemonId) {
        set({
          ptcgState: {
            ...ptcgState,
            playerActive: {
              ...ptcgState.playerActive,
              energy: [...ptcgState.playerActive.energy, energyType as any]
            }
          }
        });
      } else {
        const benchIndex = ptcgState.playerBench.findIndex(p => p.card.id === pokemonId);
        if (benchIndex !== -1) {
          const newBench = [...ptcgState.playerBench];
          newBench[benchIndex] = {
            ...newBench[benchIndex],
            energy: [...newBench[benchIndex].energy, energyType as any]
          };
          set({
            ptcgState: {
              ...ptcgState,
              playerBench: newBench
            }
          });
        }
      }
    }
  },

  switchActive: (benchIndex, side) => {
    const { ptcgState } = get();
    if (!ptcgState) return;

    if (side === 'player') {
      const benchPokemon = ptcgState.playerBench[benchIndex];
      if (!benchPokemon) return;

      const newBench = [...ptcgState.playerBench];
      newBench[benchIndex] = ptcgState.playerActive 
        ? { ...ptcgState.playerActive, position: 'bench', benchIndex }
        : newBench[benchIndex];

      set({
        ptcgState: {
          ...ptcgState,
          playerActive: { ...benchPokemon, position: 'active' },
          playerBench: newBench.filter(p => p.card.id !== benchPokemon.card.id)
        }
      });
    }
  },

  endTurn: () => {
    const { ptcgState } = get();
    if (!ptcgState) return;

    set({
      ptcgState: {
        ...ptcgState,
        phase: 'end'
      }
    });

    setTimeout(() => {
      get().nextTurn();
    }, 1000);
  },

  setWeather: (weather) => {
    const { ptcgState } = get();
    if (!ptcgState) return;

    set({
      ptcgState: {
        ...ptcgState,
        weather
      }
    });
  },

  resetBattle: () => {
    set({
      ptcgState: null,
      opcgState: null,
      currentGame: null,
      isPlaying: false
    });
  }
}));