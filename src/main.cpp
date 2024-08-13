#include "modules/Stockfish/Stockfish.cpp"
#include "modules/Pieces/Utils/Position/Position.cpp"
#include "modules/Common/Config/Config.cpp"
#include "modules/Pieces/Utils/RawPosition/RawPosition.cpp"
#include "modules/Common/GameState/GameStateImpl.cpp"
#include "modules/Common/Collision/CollisionImpl.cpp"
#include "modules/GameController/PossibleMove/PossibleMoveParams/PossibleMoveParams.cpp"
#include "modules/GameController/GameControllerImpl.cpp"
#include "modules/Pieces/PieceImpl.cpp"
#include "modules/Board/BoardBuilder/DrawRectParams/DrawRectParams.cpp"
#include "modules/GameController/PossibleMove/PossibleMoveImpl.cpp"
#include "modules/PiecesLoader/PiecesLoaderImpl.cpp"
#include "modules/Board/BoardBuilder/BoardBuilderImpl.cpp"
#include "modules/Common/InstanceOf/InstanceOf.cpp"
#include "modules/Board/BoardImpl.cpp"
#include "modules/App/AppImpl.cpp"
#include "modules/Pieces/Utils/StateController/StateController.cpp"
#include "modules/Pieces/Utils/WithAnalizeDirections/WithAnalizeDirectionsImpl.cpp"
#include "modules/Pieces/Utils/WithBishopMoves/WithBishopMovesImpl.cpp"
#include "modules/Pieces/Utils/WithRookMoves/WithRookMovesImpl.cpp"
#include "modules/Pieces/Utils/CastlePiece/CastlePiece.cpp"
#include "modules/Pieces/Utils/HasMoved/HasMoved.cpp"
#include "modules/Pieces/Kinds/Pawn/Pawn.cpp"
#include "modules/Pieces/Kinds/Knight/Knight.cpp"
#include "modules/Pieces/Kinds/Bishop/Bishop.cpp"
#include "modules/Pieces/Kinds/Queen/Queen.cpp"
#include "modules/Pieces/Kinds/Rook/Rook.cpp"
#include "modules/Pieces/Kinds/King/King.cpp"

#include <SDL.h>
#include <thread>
#include <vector>
#include <string>
#include <iostream>
#include <functional>

using std::string;
using std::vector;

int main() {
    const int SCREEN_WIDTH  = 800;
    const int SCREEN_HEIGHT = 800;

    Config config = Config(
        std::min(SCREEN_WIDTH, SCREEN_HEIGHT),
        10,
        5
    );

    GameControllerParams params = GameControllerParams();

    params.config = &config;

    GameController gameController = GameController(&params);

    AppParams appParams = AppParams();

    appParams.title          = "SDL & C++ Chess";
    appParams.config         = &config;
    appParams.screenWidth    = SCREEN_WIDTH;
    appParams.screenHeight   = SCREEN_HEIGHT;
    appParams.gameController = &gameController;

    App app(&appParams);

    Stockfish stockfish = Stockfish();

    vector<string> messages = vector<string>();

    stockfish.setOnMessage([&](string message) -> void {
        messages.push_back(message);
    });

    std::thread stockfishThread(Stockfish::run, &stockfish);

    app.init();

    stockfish.setRunning(false);

    stockfishThread.join();

	return 0;
}
