data = read.csv("C:\\Users\\liu.6544\\Documents\\GitHub\\CoronavirusTransit\\data\\actual_ridership\\correlation.csv")
wfh_pop_rate = data$Work.from.home.populuation.ratio
all_working_pop = data$All.working.population
transit_pop_rate = data$Transit.commuting.population.ratio
google_trend = data$X..Unique.users
social_rate = data$social_rate
B = data$B
pop = data$pop
pp55 = data$pp55
pp65 = data$pp65
pp75 = data$pp75
pp85 = data$pp85

fit <- lm(B ~ Work.from.home.populuation.ratio + social_rate + pp55, data=data)
summary(fit)  # show results

car::vif(fit)
cor.test(pp75, social_rate)

