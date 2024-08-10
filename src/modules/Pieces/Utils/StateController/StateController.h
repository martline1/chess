#pragma once

#include <map>
#include <string>
#include <functional>

using std::map;
using std::string;
using std::function;

struct StateContent;

typedef map<string, StateContent> State;

class StateController {
    private:
        State state;

    public:
        StateController();

        State* getState();
};
