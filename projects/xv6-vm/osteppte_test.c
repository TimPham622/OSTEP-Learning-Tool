#include "kernel/types.h"
#include "user/user.h"
int main(void){volatile int local=0;int code=ostep_pte((uint64)main),stack=ostep_pte((uint64)&local);
 if((code&25)!=25||(stack&21)!=21||ostep_pte(~0ULL)!=0||(code&~31)||(stack&~31)){printf("FAIL pte inspection\n");exit(1);}
 printf("PASS pte inspection\n");exit(0);}
