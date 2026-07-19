import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './ptcg-battle.module.scss';
import { useBattleStore } from '@/stores/battleStore';
import { ptcgCards, PokemonBattleCard } from '@/data/cards';
import { BattleState, FieldPokemon, WeatherType } from '@/types';
import { WEATHER_EFFECTS } from '@/types';

const PTCGBattlePage = () => {
  const { ptcgState, initPTCGBattle, drawCard, playCard, attack, endTurn, setWeather } = useBattleStore();
  const [gameState, setGameState] = useState<BattleState | null>(null);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [weather, setWeatherState] = useState<WeatherType | null>(null);

  useEffect(() => {
    if (!ptcgState) {
      const playerDeck: PokemonBattleCard[] = [];
      const opponentDeck: PokemonBattleCard[] = [];
      
      ptcgCards.forEach(card => {
        for (let i = 0; i < 4; i++) {
          playerDeck.push({ ...card, id: `${card.id}-p-${i}` });
          opponentDeck.push({ ...card, id: `${card.id}-o-${i}` });
        }
      });
      
      initPTCGBattle(playerDeck.slice(0, 60), opponentDeck.slice(0, 60), 'sunny');
    } else {
      setGameState(ptcgState);
      setWeatherState(ptcgState.weather);
    }
  }, [ptcgState, initPTCGBattle]);

  const handlePlayCard = (cardId: string) => {
    playCard(cardId, 'player');
    setSelectedCard(null);
  };

  const handleAttack = () => {
    if (gameState?.playerActive) {
      attack(gameState.playerActive.card.id, gameState.opponentActive?.card.id || '');
    }
  };

  const handleEndTurn = () => {
    endTurn();
  };

  const handleDrawCard = () => {
    drawCard('player');
  };

  const formatHP = (current: number, max: number) => {
    const percent = (current / max) * 100;
    return `${current}/${max} (${Math.round(percent)}%)`;
  };

  const renderFieldPokemon = (pokemon: FieldPokemon | null, isPlayer: boolean) => {
    if (!pokemon) return null;
    
    return (
      <View className={styles.fieldPokemon}>
        <Image className={styles.fieldCard} src={pokemon.card.image} mode='aspectFit' />
        <View className={styles.pokemonInfo}>
          <Text className={styles.pokemonName}>{pokemon.card.name}</Text>
          <View className={styles.hpBar}>
            <View className={styles.hpFill} style={{ width: `${((pokemon.card.maxHp - pokemon.damage) / pokemon.card.maxHp) * 100}%` }} />
          </View>
          <Text className={styles.hpText}>{formatHP(pokemon.card.maxHp - pokemon.damage, pokemon.card.maxHp)}</Text>
          <View className={styles.energyIcons}>
            {pokemon.energy.map((e, i) => (
              <Text key={i} className={styles.energyIcon}>{getEnergyIcon(e)}</Text>
            ))}
          </View>
        </View>
        {pokemon.status && (
          <Text className={styles.statusIcon}>{getStatusIcon(pokemon.status)}</Text>
        )}
      </View>
    );
  };

  const getEnergyIcon = (type: string) => {
    const icons: Record<string, string> = {
      fire: '🔥', water: '💧', grass: '🌿', electric: '⚡', psychic: '🔮',
      dark: '🌙', fighting: '💪', steel: '⚙️', dragon: '🐉', fairy: '✨',
      colorless: '⬜'
    };
    return icons[type] || '⬜';
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, string> = {
      asleep: '😴', paralyzed: '💫', poisoned: '☠️', burned: '🔥', confused: '😵'
    };
    return icons[status] || '';
  };

  if (!gameState) {
    return (
      <View className={styles.container}>
        <View className={styles.loading}>
          <Text>正在准备对战...</Text>
        </View>
      </View>
    );
  }

  return (
    <View className={styles.container}>
      <View className={styles.weatherBanner}>
        {weather && (
          <Text className={styles.weatherText}>
            🌤️ {WEATHER_EFFECTS[weather].name}
          </Text>
        )}
      </View>

      <View className={styles.opponentArea}>
        <View className={styles.opponentInfo}>
          <Text className={styles.opponentName}>对手</Text>
          <Text className={styles.opponentPrize}>奖卡: {gameState.opponentPrizeCards.length}/6</Text>
        </View>
        
        <View className={styles.opponentDeck}>
          <Text className={styles.deckCount}>{gameState.opponentDeck.length}</Text>
          <Text className={styles.deckLabel}>牌库</Text>
        </View>
        
        <View className={styles.opponentPrizeCards}>
          {gameState.opponentPrizeCards.map((_, i) => (
            <View key={i} className={styles.prizeCard} />
          ))}
        </View>

        <View className={styles.opponentActiveArea}>
          <Text className={styles.areaLabel}>战斗场</Text>
          {renderFieldPokemon(gameState.opponentActive, false)}
        </View>

        <View className={styles.opponentBench}>
          <Text className={styles.areaLabel}>备战区</Text>
          <View className={styles.benchSlots}>
            {Array(5).fill(null).map((_, i) => {
              const benchPokemon = gameState.opponentBench.find(p => p.benchIndex === i);
              return benchPokemon ? (
                <View key={i} className={styles.benchSlot}>
                  <Image className={styles.benchCard} src={benchPokemon.card.image} mode='aspectFit' />
                </View>
              ) : (
                <View key={i} className={styles.emptySlot} />
              );
            })}
          </View>
        </View>

        <View className={styles.opponentDiscard}>
          <Text className={styles.discardCount}>{gameState.opponentDiscard.length}</Text>
          <Text className={styles.discardLabel}>弃牌区</Text>
        </View>
      </View>

      <View className={styles.battleField}>
        <View className={styles.turnInfo}>
          <Text className={styles.turnText}>回合 {gameState.turn}</Text>
          <Text className={`${styles.phaseText} ${styles[gameState.phase]}`}>
            {gameState.phase === 'draw' && '抽牌阶段'}
            {gameState.phase === 'main' && '主要阶段'}
            {gameState.phase === 'attack' && '攻击阶段'}
            {gameState.phase === 'end' && '结束阶段'}
          </Text>
        </View>
      </View>

      <View className={styles.playerArea}>
        <View className={styles.playerInfo}>
          <Text className={styles.playerName}>我方</Text>
          <Text className={styles.playerPrize}>奖卡: {6 - gameState.playerPrizeCards.length}/6</Text>
        </View>

        <View className={styles.playerDeck} onClick={handleDrawCard}>
          <Text className={styles.deckCount}>{gameState.playerDeck.length}</Text>
          <Text className={styles.deckLabel}>牌库</Text>
          <Text className={styles.deckAction}>点击抽牌</Text>
        </View>

        <View className={styles.playerPrizeCards}>
          {gameState.playerPrizeCards.map((_, i) => (
            <View key={i} className={styles.prizeCard} />
          ))}
        </View>

        <View className={styles.playerActiveArea}>
          <Text className={styles.areaLabel}>战斗场</Text>
          {renderFieldPokemon(gameState.playerActive, true)}
        </View>

        <View className={styles.playerBench}>
          <Text className={styles.areaLabel}>备战区</Text>
          <ScrollView className={styles.benchScroll} scrollX>
            <View className={styles.benchSlots}>
              {gameState.playerBench.map(pokemon => (
                <View 
                  key={pokemon.card.id} 
                  className={styles.benchSlot}
                  onClick={() => gameState.playerActive && switchActive(pokemon.benchIndex || 0, 'player')}
                >
                  <Image className={styles.benchCard} src={pokemon.card.image} mode='aspectFit' />
                  <Text className={styles.benchHP}>{pokemon.card.maxHp - pokemon.damage}/{pokemon.card.maxHp}</Text>
                </View>
              ))}
              {gameState.playerBench.length < 5 && (
                <View className={styles.emptySlot} />
              )}
            </View>
          </ScrollView>
        </View>

        <View className={styles.playerDiscard}>
          <Text className={styles.discardCount}>{gameState.playerDiscard.length}</Text>
          <Text className={styles.discardLabel}>弃牌区</Text>
        </View>

        <View className={styles.handArea}>
          <Text className={styles.areaLabel}>手牌 ({gameState.playerHand.length})</Text>
          <ScrollView className={styles.handScroll} scrollX>
            <View className={styles.handCards}>
              {gameState.playerHand.map(card => (
                <View 
                  key={card.id} 
                  className={`${styles.handCard} ${selectedCard === card.id ? styles.selected : ''}`}
                  onClick={() => setSelectedCard(selectedCard === card.id ? null : card.id)}
                >
                  <Image className={styles.cardImage} src={card.image} mode='aspectFit' />
                  {card.types && (
                    <View className={styles.cardTypes}>
                      {card.types.map((t, i) => (
                        <Text key={i} className={styles.typeIcon}>{getEnergyIcon(t)}</Text>
                      ))}
                    </View>
                  )}
                  <Text className={styles.cardHP}>{card.hp}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        <View className={styles.actionButtons}>
          {selectedCard && (
            <View className={styles.actionBtn} onClick={() => handlePlayCard(selectedCard)}>
              <Text>打出卡牌</Text>
            </View>
          )}
          {gameState.playerActive && (
            <View className={styles.actionBtn} onClick={handleAttack}>
              <Text>⚔️ 攻击</Text>
            </View>
          )}
          <View className={styles.actionBtn} onClick={handleEndTurn}>
            <Text>结束回合</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default PTCGBattlePage;