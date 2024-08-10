#pragma once

#include <SDL.h>
#include <SDL2_image/SDL_image.h>

#include <memory>
#include <cmath>
#include <string>
#include <iostream>
#include <algorithm>

using std::string;
using std::unique_ptr;
using std::make_unique;

struct AppParams;

class App {
    private:
        bool quit;
        string title;
        int screenWidth;
        int screenHeight;
        SDL_Window* window;
        SDL_Surface* image;
        SDL_Renderer* renderer;

    public:
        class AppImpl;
        unique_ptr<AppImpl> appImpl;

        App(AppParams*);

        void init();
        void setup();
        void update();
        string getTitle();
        void eventListener();
        int getScreenWidth();
        int getScreenHeight();
        SDL_Window* getWindow();
        SDL_Renderer* getRenderer();
        void handlePointerEvents(bool&);

        ~App();
};
