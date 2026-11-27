/* Add in user/ and UPROGS after implementing ostep_info. */
#include "kernel/types.h"
#include "user/user.h"
int main(void){int pid=-1;int *heap=malloc(sizeof(int));
 if(!heap||ostep_info(&pid)!=0||pid!=getpid()||ostep_info(heap)!=0||*heap!=getpid()||ostep_info((int*)~0ULL)!=-1){printf("FAIL ostep_info\n");exit(1);}
 free(heap);printf("PASS ostep_info\n");exit(0);}
