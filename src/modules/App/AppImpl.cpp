#pragma once

#include "App.h"

#include "../Board/Board.h"
#include "../Pieces/Piece.h"
#include "../Common/Config/Config.h"
#include "../PiecesLoader/PiecesLoader.h"
#include "../GameController/GameController.h"

struct AppParams {
    string title;
    Config* config;
    int screenWidth;
    int screenHeight;
    GameController* gameController;
};

class App::AppImpl {
    private:
        Config* config;
        unique_ptr<Board> board;
        GameController* gameController;
        unique_ptr<PiecesLoader> piecesLoader;

    public:
        AppImpl():
            board(make_unique<Board>()),
            piecesLoader(make_unique<PiecesLoader>())
        {}

        void setGameController(GameController* gameController) {
            this->gameController = gameController;
        }

        void setConfig(Config* config) {
            this->config = config;
        }

        GameController* getGameController() {
            return this->gameController;
        }

        Config* getConfig() {
            return this->config;
        }

        unique_ptr<Board>& getBoard() {
            return this->board;
        }

        unique_ptr<PiecesLoader>& getPiecesLoader() {
            return this->piecesLoader;
        }
};

App::App(AppParams* params):
    quit(false),
    image(nullptr),
    title(params->title),
    appImpl(make_unique<AppImpl>()),
    screenWidth(params->screenWidth),
    screenHeight(params->screenHeight)
{
    this->appImpl->setConfig(params->config);
    this->appImpl->setGameController(params->gameController);
}

void App::init() {
	// Initialize SDL
    if (SDL_Init(SDL_INIT_EVERYTHING) == -1) {
        std::cout
            << "SDL could not initialize! SDL_Error: "
            << SDL_GetError()
            << std::endl;

        return;
    }

    if (IMG_Init(IMG_INIT_PNG) == 0)  {
        std::cout
            << "SDL could not initialize SDL image, "
            << SDL_GetError()
            << std::endl;

        return;
    }

    this->window = nullptr;

    // Create window
    this->window = SDL_CreateWindow(
        this->title.c_str(),
        SDL_WINDOWPOS_UNDEFINED,
        SDL_WINDOWPOS_UNDEFINED,
        this->screenWidth,
        this->screenHeight,
        SDL_WINDOW_SHOWN
    );

    if (window == nullptr || window == NULL) {
        std::cout
            << "Window could not be created! SDL_Error: "
            << SDL_GetError()
            << std::endl;

        return;
    }

    this->renderer = nullptr;

    this->renderer = SDL_CreateRenderer(
        window,
        -1,
        SDL_RENDERER_ACCELERATED
    );

    if (this->renderer == nullptr) {
        std::cout
            << "SDL could not initialize renderer!"
            << std::endl;

        return;
    }

    SDL_SetRenderDrawBlendMode(this->renderer, SDL_BLENDMODE_BLEND);

    this->setup();

    this->eventListener();
}

void App::setup() {
    unique_ptr<Board>& board = this->appImpl->getBoard();

    board->boardImpl->setFather(this);
    board->boardImpl->setConfig(this->appImpl->getConfig());
    board->init();

    unique_ptr<PiecesLoader>& piecesLoader = this->appImpl->getPiecesLoader();

    piecesLoader->piecesLoaderImpl->setApp(this);
    piecesLoader->piecesLoaderImpl->setConfig(this->appImpl->getConfig());
    piecesLoader->piecesLoaderImpl->setGameController(this->appImpl->getGameController());

    piecesLoader->loadTexture();
    piecesLoader->loadPieces();

    GameController* gameController = this->appImpl->getGameController();

    gameController->gameControllerImpl->setApp(this);

    gameController->gameControllerImpl->setPieces(
        piecesLoader->piecesLoaderImpl->getPieces().get()
    );
    gameController->gameControllerImpl->setPiecesLoader(
        piecesLoader.get()
    );
    gameController->gameControllerImpl->setPiecePtrs(
        piecesLoader->piecesLoaderImpl->getPiecePtrs()
    );
    gameController->gameControllerImpl->setBoardBuilder(
        board->boardImpl->getBoardBuilder().get()
    );

    gameController->startGame();
}

void App::update() {
    // Render board
    this->appImpl->getBoard()->render();

    // Render pieces
    unique_ptr<PiecesLoader>& piecesLoader = this->appImpl->getPiecesLoader();
    vector<Piece<RawPosition>*>* piecePtrs = piecesLoader->piecesLoaderImpl->getPiecePtrs();

    for (Piece<RawPosition>* piece: *piecePtrs) {
        piece->render();
    }

    // Render possible moves if any
    this->appImpl->getGameController()->render();
}

void App::handlePointerEvents(bool& mouseButtonDown) {
    int mouseX, mouseY;
    bool shouldBeCursor = false;

    SDL_GetGlobalMouseState(&mouseX, &mouseY);

    unique_ptr<PiecesLoader>& piecesLoader = this->appImpl->getPiecesLoader();
    vector<Piece<RawPosition>*>* piecePtrs = piecesLoader->piecesLoaderImpl->getPiecePtrs();

    for (Piece<RawPosition>* piece: *piecePtrs) {
        bool isBeingHovered = piece->isBeingHovered(mouseX, mouseY);

        if (isBeingHovered) {
            shouldBeCursor = true;
        }

        if (mouseButtonDown) {
            piece->onPointerDown(mouseX, mouseY);
        }
    }

    vector<PossibleMove*>* possibleMoves =
        this->appImpl->getGameController()->gameControllerImpl->getPossibleMoves();
    
    for (PossibleMove* possibleMove: *possibleMoves) {
        bool isBeingHovered = possibleMove->isBeingHovered(mouseX, mouseY);

        if (isBeingHovered) {
            shouldBeCursor = true;
        }

        if (mouseButtonDown) {
            possibleMove->onPointerDown(mouseX, mouseY);
        }
    }

    // TODO: Add memoization to cursor value
    if (shouldBeCursor) {
        SDL_Cursor* cursor = SDL_CreateSystemCursor(SDL_SYSTEM_CURSOR_HAND);

        SDL_SetCursor(cursor);
    } else {
        SDL_Cursor* cursor = SDL_CreateSystemCursor(SDL_SYSTEM_CURSOR_ARROW);

        SDL_SetCursor(cursor);
    }
}

string App::getTitle() {
    return this->title;
}

void App::eventListener() {
    SDL_Event e;

    while (!this->quit) {
        bool mouseButtonDown = false;

        if (SDL_PollEvent(&e)) {
            switch(e.type){
                case SDL_QUIT: {
                    this->quit = true;

                    continue;
                }
                case SDL_MOUSEBUTTONDOWN: {
                    mouseButtonDown = true;

                    break;
                }
            }
        }

        this->handlePointerEvents(mouseButtonDown);

        SDL_SetRenderDrawColor(this->renderer, 255, 255, 255, 255);
        SDL_RenderClear(this->renderer);

        this->update();

        SDL_RenderPresent(this->renderer);

    }
}

int App::getScreenWidth() {
    return this->screenWidth;
}

int App::getScreenHeight() {
    return this->screenHeight;
}

SDL_Renderer* App::getRenderer() {
    return this->renderer;
}

SDL_Window* App::getWindow() {
    return this->window;
}

App::~App() {
    SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(window);

    IMG_Quit();
    SDL_Quit();
}
