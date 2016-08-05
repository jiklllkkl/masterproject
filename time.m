addpath('./jsonlab');

format shortg;
while true
    % c = [year month day hour minute seconds]
    c=clock;
    % Rounding every value to an integer
    c=fix(c);
    x.clock=c;
    % accessing the 4th column of c, i.e hours
    x.hours=c(:,4);
    % accessing the 5th column of c ,i.e minutes
    x.minutes=c(:,5);
    % accessing the 6th column of c, i.e seconds
    x.seconds=c(:,6);
    % converting x into JSON and writing as matlabData.json
    savejson('',x,'data/matlabData.json');
end