#pragma once

#include <memory>
#include <functional>

using std::vector;
using std::function;
using std::unique_ptr;
using std::make_unique;

struct GameControllerParams;

class GameController {
    public:
        class GameControllerImpl;
        unique_ptr<GameControllerImpl> gameControllerImpl;

        GameController(GameControllerParams*);

        void render();
        void startGame();
        void onPieceMoved();
};
