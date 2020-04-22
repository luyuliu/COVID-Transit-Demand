data = read.csv("C:\\Users\\liu.6544\\Documents\\GitHub\\CoronavirusTransit\\data\\actual_ridership\\correlation.csv")
wfh_pop_rate = data$Work.from.home.populuation.ratio
all_working_pop = data$All.working.population
transit_pop_rate = data$Transit.commuting.population.ratio
google_trend = data$X..Unique.users
social_rate = data$rate
B = data$B
pop = data$pop

fit <- lm(B ~ Work.from.home.populuation.ratio + Population.commutes.using.transit + social_rate, data=data)
summary(fit) # show results
