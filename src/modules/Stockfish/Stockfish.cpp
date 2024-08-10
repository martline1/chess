#pragma once

#include "Stockfish.h"

Stockfish::Stockfish() {}

void Stockfish::run(Stockfish* stockfish) {
    try {
        string path = SDL_GetBasePath();
        string stockfishPath = path + "stockfish";

        const int sizebuf = 9999;
        char buff[sizebuf];

        FILE* file = popen(stockfishPath.c_str(), "w");

        while (stockfish->getRunning() && fgets(buff, sizeof (buff), file)) {
            string sentence = buff;

            stockfish->pushLog(sentence);
        }

        pclose(file);
    } catch(...) {}
}

bool Stockfish::getRunning() {
    lock_guard<mutex> getRunningLock(this->stockfishMutex);

    return this->running;
}

void Stockfish::pushLog(string log) {
    unique_lock<mutex> pushLogLock(this->stockfishMutex);

    this->out.push_back(log);

    pushLogLock.unlock();
}

void Stockfish::setRunning(bool value) {
    unique_lock<mutex> setRunningLock(this->stockfishMutex);
    
    this->running = value;

    setRunningLock.unlock();
}

vector<string> Stockfish::getOut() {
    lock_guard<mutex> getRunningLock(this->stockfishMutex);

    return this->out;
}

void Stockfish::setOnMessage(Lambda callback) {
    unique_lock<mutex> setOnMessageLock(this->stockfishMutex);

    this->onMessage = callback;

    setOnMessageLock.unlock();
}
