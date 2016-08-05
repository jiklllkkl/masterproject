function [] = dummy(stockName)
if (strcmp(stockName, 'GOOG'))
    expectState = 0;
elseif (strcmp(stockName, 'IBM'))
    expectState = 1;
else
    expectState = -1;
end

disp(expectState);

fileID = fopen('mostRecentResult.json', 'w');
fprintf(fileID, '{"stockName":"%s", "rise": %d}', stockName, expectState);
fclose(fileID);
exit;