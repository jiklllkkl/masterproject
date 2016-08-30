function [] = dummy(stockName)
if (strcmp(stockName, 'GOOG'))
    expectState = 0;
elseif (strcmp(stockName, 'IBM'))
    expectState = 1;
else
    expectState = -1;
end

disp(expectState);

dropProb = 30.01;
sameProb = 19.99;
riseProb = 50;

fileID = fopen(fullfile('..', 'backend', 'data', 'mostRecentResult.json'), 'w');
fprintf(fileID, '{"stockName":"%s", "dropProb": %.2f, "sameProb": %.2f, "riseProb": %.2f}', stockName, dropProb, sameProb, riseProb);
fclose(fileID);
exit;