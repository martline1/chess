#include <SDL.h>
#include <thread>
#include <vector>
#include <string>
#include <iostream>
#include <functional>

#include <chrono>
#include <stdlib.h>

#include "deps.cpp"

using std::string;
using std::vector;

void setTimeOut(int ms, std::function<void()> callback) {
    std::this_thread::sleep_for(std::chrono::milliseconds(ms));

    callback();
}

int main() {
    std::thread timeOutThread(setTimeOut, 5000, []() -> void {
        system("CLS");
        system("clear");
    });

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
    timeOutThread.join();

	return 0;
}
