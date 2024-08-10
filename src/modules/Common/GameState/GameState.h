#pragma once

#include <string>
#include <vector>
#include <memory>

using std::string;
using std::vector;
using std::unique_ptr;
using std::make_unique;

struct GetValidPieceResponse;

class GameState {
    public:
        class GameStateImpl;
        unique_ptr<GameStateImpl> gameStateImpl;

        GameState();
};
