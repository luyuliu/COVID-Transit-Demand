data = read.csv("C:\\Users\\liu.6544\\Documents\\GitHub\\CoronavirusTransit\\doc\\excels\\actual_ridership_t_test.csv")
y = data$Official.ridership.decrease.from.transit.systems
x = data$Demand.decrease.from.Transit.app
t.test(y,x,paired=TRUE)

