import React, { useState, useEffect, useRef } from 'react';
import { ThreeCafeScene } from './components/ThreeCafeScene';
import { MainGameMenu } from './components/MainGameMenu';
import { RondaGameHud } from './components/RondaGameHud';
import { DamaView } from './components/DamaView';
import { HezJoujView } from './components/HezJoujView';
import { ShopModal } from './components/ShopModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { CityModal } from './components/CityModal';
import { SettingsModal } from './components/SettingsModal';
import { RulesModal } from './components/RulesModal';
import { LocationsModal } from './components/LocationsModal';
import { RondaGame, TurnActionFeedback } from './game/rondaEngine';
import { CardBackStyle, CafeCupStyle, GameLocation, GameOptions, GameMode } from './types/cards';
import { soundManager } from './utils/audio';
import confetti from 'canvas-confetti';

export default function App() {
  // Game Mode State
  const [mode, setMode] = useState<GameMode>('ronda');
  const [isPlayingRonda, setIsPlayingRonda] = useState<boolean>(false);

  // Player Profile
  const [playerName, setPlayerName] = useState<string>('Abdelhaq');
  const [playerCity, setPlayerCity] = useState<string>('زاكورة');
  const [coins, setCoins] = useState<number>(50);

  // Customization & Shop
  const [cardBackStyle, setCardBackStyle] = useState<CardBackStyle>('classic');
  const [unlockedBacks, setUnlockedBacks] = useState<CardBackStyle[]>(['classic']);
  const [activeCup, setActiveCup] = useState<CafeCupStyle>('chamali');
  const [unlockedCups, setUnlockedCups] = useState<CafeCupStyle[]>(['chamali']);
  const [location, setLocation] = useState<GameLocation>('cafe');

  // Game Settings & Options
  const [is4Players, setIs4Players] = useState<boolean>(true);
  const [targetScore, setTargetScore] = useState<number>(21);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [options, setOptions] = useState<GameOptions>({
    darbWRja3: true,
    fourCardsVersion: false,
    cafeBluffMode: false,
    tableTalk: true,
    partnerAdvice: true,
    speed: 'fast',
  });

  // Camera View
  const [cameraView, setCameraView] = useState<'overhead' | 'cinematic' | 'dama'>('overhead');

  // Modals
  const [showShop, setShowShop] = useState<boolean>(false);
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);
  const [showCityModal, setShowCityModal] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showRules, setShowRules] = useState<boolean>(false);
  const [rulesInitialTab, setRulesInitialTab] = useState<'ronda' | 'dama' | 'hez_jouj'>('ronda');
  const [showLocations, setShowLocations] = useState<boolean>(false);

  // Audio Toggles
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [radioEnabled, setRadioEnabled] = useState<boolean>(false);

  // Ronda Game Instance
  const [rondaGame, setRondaGame] = useState<RondaGame>(
    () => new RondaGame(playerName, playerCity, is4Players, targetScore, options)
  );
  const [tableCards, setTableCards] = useState(rondaGame.tableCards);
  const [humanCards, setHumanCards] = useState(rondaGame.players[0]?.hand || []);
  const [lastFeedback, setLastFeedback] = useState<TurnActionFeedback | null>(null);
  const [partnerHint, setPartnerHint] = useState<string | null>(null);
  const [, setRondaTick] = useState(0);

  // Initialize new Ronda game
  const initRonda = () => {
    const newGame = new RondaGame(playerName, playerCity, is4Players, targetScore, options);
    setRondaGame(newGame);
    setTableCards([...newGame.tableCards]);
    setHumanCards([...newGame.players[0].hand]);
    setLastFeedback(null);
    setPartnerHint(null);
    setIsPlayingRonda(true);
    setMode('ronda');
    setCameraView('overhead');
  };

  // Sync game table cards and player cards to state
  const syncGameState = () => {
    setTableCards([...rondaGame.tableCards]);
    setHumanCards([...(rondaGame.players[0]?.hand || [])]);
    setRondaTick(t => t + 1);
  };

  // Human player plays a card
  const handlePlayHumanCard = (cardId: string) => {
    if (rondaGame.currentTurnIndex !== 0 || rondaGame.gameOver || rondaGame.isDealing) return;
    try {
      const feedback = rondaGame.playCard(0, cardId);
      setLastFeedback(feedback);
      syncGameState();

      if (rondaGame.gameOver && rondaGame.winnerTeam === 0) {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
        setCoins(c => c + 30);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Automated AI turns for Ronda
  useEffect(() => {
    if (!isPlayingRonda || mode !== 'ronda' || rondaGame.gameOver) return;

    if (rondaGame.currentTurnIndex !== 0) {
      const delay = options.speed === 'fast' ? 700 : options.speed === 'normal' ? 1200 : 1800;
      const timer = window.setTimeout(() => {
        const curIdx = rondaGame.currentTurnIndex;
        if (curIdx !== 0 && !rondaGame.gameOver) {
          const cardId = rondaGame.getAiBestMove(curIdx);
          if (cardId) {
            const feedback = rondaGame.playCard(curIdx, cardId);
            setLastFeedback(feedback);
            syncGameState();

            if (rondaGame.gameOver && rondaGame.winnerTeam === 0) {
              confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
              setCoins(c => c + 30);
            }
          }
        }
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [rondaGame.currentTurnIndex, isPlayingRonda, mode, options.speed]);

  // Partner advice / Hint (وصية الصاحب)
  const handlePartnerHint = () => {
    if (rondaGame.players.length === 4) {
      const p = rondaGame.players[0];
      const match = p.hand.find(c => rondaGame.tableCards.some(tc => tc.rank === c.rank));
      if (match) {
        setPartnerHint(`صاحبك رفيق كيوصيك: لوّح ${match.nameAr} د ${match.suitNameAr} راك كتشد بيها! 👍`);
      } else {
        setPartnerHint(`صاحبك رفيق: ما كاين ما يتشد دابا، لوّح شي كارتة مفرقة وسلّك راسك! 😉`);
      }
      setTimeout(() => setPartnerHint(null), 4000);
    } else {
      setPartnerHint('ركّز مع الكارطة اللي كتكرر وما تزكلش الضربة ورجعة!');
      setTimeout(() => setPartnerHint(null), 3000);
    }
  };

  // Sound and Radio Handlers
  const toggleSound = () => {
    soundManager.soundEnabled = !soundManager.soundEnabled;
    setSoundEnabled(soundManager.soundEnabled);
  };

  const toggleRadio = () => {
    const state = soundManager.toggleRadio();
    setRadioEnabled(state);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#120a05] text-[#f7e6c4] font-['Tajawal',sans-serif]">
      {/* 1. Underlying 3D Moroccan Cafe Viewport (Three.js r160+) */}
      <ThreeCafeScene
        mode={mode}
        tableCards={tableCards}
        cardBackStyle={cardBackStyle}
        cameraView={mode === 'dama' ? 'dama' : cameraView}
        hajBrahimActive={mode === 'dama'}
      />

      {/* 2. Top-level Screen Modes */}
      {!isPlayingRonda && mode === 'ronda' && (
        <MainGameMenu
          playerName={playerName}
          playerCity={playerCity}
          is4Players={is4Players}
          setIs4Players={setIs4Players}
          targetScore={targetScore}
          setTargetScore={setTargetScore}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          location={location}
          options={options}
          setOptions={setOptions}
          onStartGame={initRonda}
          onStartDama={() => {
            setMode('dama');
            setCameraView('dama');
          }}
          onStartHezJouj={() => {
            setMode('hez_jouj');
            setCameraView('cinematic');
          }}
          onOpenLocations={() => setShowLocations(true)}
          onOpenShop={() => setShowShop(true)}
          onOpenLeaderboard={() => setShowLeaderboard(true)}
          onOpenCityModal={() => setShowCityModal(true)}
          onOpenSettings={() => setShowSettings(true)}
          onOpenRules={() => {
            setRulesInitialTab('ronda');
            setShowRules(true);
          }}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
          radioEnabled={radioEnabled}
          onToggleRadio={toggleRadio}
        />
      )}

      {/* Ronda Gameplay HUD */}
      {isPlayingRonda && mode === 'ronda' && (
        <RondaGameHud
          game={rondaGame}
          humanPlayerCards={humanCards}
          onPlayCard={handlePlayHumanCard}
          onOpenMenu={() => setIsPlayingRonda(false)}
          onToggleCamera={() => {
            setCameraView(v => (v === 'overhead' ? 'cinematic' : 'overhead'));
          }}
          onToggleRadio={toggleRadio}
          radioEnabled={radioEnabled}
          onToggleSound={toggleSound}
          soundEnabled={soundEnabled}
          onStartDama={() => {
            setMode('dama');
            setCameraView('dama');
          }}
          onStartHezJouj={() => {
            setMode('hez_jouj');
            setCameraView('cinematic');
          }}
          onGetPartnerHint={handlePartnerHint}
          partnerHintText={partnerHint}
          lastFeedback={lastFeedback}
          onRestart={initRonda}
          onExit={() => setIsPlayingRonda(false)}
        />
      )}

      {/* Dama Minigame View (Checkers with Haj Brahim) */}
      {mode === 'dama' && (
        <DamaView
          onBack={() => {
            setMode('ronda');
            setCameraView('overhead');
          }}
          onRewardCoins={amt => setCoins(c => c + amt)}
          onOpenRules={() => {
            setRulesInitialTab('dama');
            setShowRules(true);
          }}
        />
      )}

      {/* Hez Jouj Minigame View (جبن كرع) */}
      {mode === 'hez_jouj' && (
        <HezJoujView
          onBack={() => {
            setMode('ronda');
            setCameraView('overhead');
          }}
          onRewardCoins={amt => setCoins(c => c + amt)}
          onOpenRules={() => {
            setRulesInitialTab('hez_jouj');
            setShowRules(true);
          }}
        />
      )}

      {/* 3. Popups & Modals */}
      {showShop && (
        <ShopModal
          coins={coins}
          unlockedBacks={unlockedBacks}
          activeBack={cardBackStyle}
          onSelectBack={setCardBackStyle}
          onBuyBack={(back, cost) => {
            if (coins >= cost) {
              setCoins(c => c - cost);
              setUnlockedBacks(b => [...b, back]);
              setCardBackStyle(back);
              soundManager.playCoin();
            }
          }}
          activeCup={activeCup}
          onSelectCup={setActiveCup}
          onBuyCup={(cup, cost) => {
            if (coins >= cost) {
              setCoins(c => c - cost);
              setUnlockedCups(u => [...u, cup]);
              setActiveCup(cup);
              soundManager.playCoin();
            }
          }}
          unlockedCups={unlockedCups}
          onClose={() => setShowShop(false)}
        />
      )}

      {showLeaderboard && (
        <LeaderboardModal
          onClose={() => setShowLeaderboard(false)}
          playerName={playerName}
        />
      )}

      {showCityModal && (
        <CityModal
          currentCity={playerCity}
          playerName={playerName}
          onSelectCity={city => {
            setPlayerCity(city);
            if (rondaGame.players[0]) {
              rondaGame.players[0].city = city;
            }
          }}
          onClose={() => setShowCityModal(false)}
        />
      )}

      {showSettings && (
        <SettingsModal
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
          graphics="medium"
          onChangeGraphics={() => {}}
          athanPause={true}
          onToggleAthan={() => {}}
          notifications={true}
          onToggleNotifications={() => {}}
          playerName={playerName}
          onClose={() => setShowSettings(false)}
        />
      )}

      {showRules && (
        <RulesModal
          initialTab={rulesInitialTab}
          onClose={() => setShowRules(false)}
        />
      )}

      {showLocations && (
        <LocationsModal
          currentLocation={location}
          onSelectLocation={loc => {
            setLocation(loc);
            setShowLocations(false);
          }}
          onClose={() => setShowLocations(false)}
        />
      )}
    </div>
  );
}
