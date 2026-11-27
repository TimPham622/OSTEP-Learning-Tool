#include "kernel/types.h"
#include "user/user.h"
int main(void){int first=ostep_ticks(),pid,status=-1;if(first<=0)exit(1);
 pid=fork();if(pid<0)exit(1);if(pid==0)exit(ostep_ticks()>0?0:1);
 if(wait(&status)!=pid||status||ostep_ticks()<first){printf("FAIL dispatch accounting\n");exit(1);}
 printf("PASS dispatch accounting\n");exit(0);}
