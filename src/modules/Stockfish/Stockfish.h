#pragma once

#include <SDL.h>

#include <mutex>
#include <vector>
#include <string>
#include <functional>

using std::mutex;
using std::vector;
using std::string;
using std::unique_lock;
using std::lock_guard;

typedef std::function<void(string)> Lambda;

class Stockfish {
    private:
        vector<string> out;
        bool running = true;
        std::mutex stockfishMutex;
        Lambda onMessage = nullptr;

    public:
        Stockfish();

        static void run(Stockfish*);

        bool getRunning();
        void pushLog(string);
        void setRunning(bool);
        vector<string> getOut();
        void setOnMessage(Lambda);
};
