#pragma once

class InstanceOf {
    public:
        template<typename Base, typename T>
        static bool check(const T*);
};
