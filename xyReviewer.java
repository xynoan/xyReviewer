import java.util.HashSet;
import java.util.Random;
import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        String[] questionnaires = {""};
        String[] answerSheet = {""};
        String[] praises = {"Great job!", "Nice!", "Keep up the good work!", "Correct!"};
        String[] motivations = {"You got this, try again!", "Don't give up!", "You're really close!"};
        HashSet<String> alreadyAsked = new HashSet<>();
        Random r = new Random();
        Scanner input = new Scanner(System.in);
        System.out.println("Welcome to 'Insert Subject' Reviewer!");
        System.out.println("Press Enter to start.");
        input.nextLine();
        int upperbound = questionnaires.length;
        int upperboundOfPraises = praises.length;
        int upperboundOfMotivations = motivations.length;
        int count = 0;
        int point = 0;
        System.out.println(questionnaires.length);
        while (true) {
            int random_questionnaire = r.nextInt(upperbound);
            int random_praise = r.nextInt(upperboundOfPraises);
            int random_motivation = r.nextInt(upperboundOfMotivations);
            String question = questionnaires[random_questionnaire];
            if (!alreadyAsked.contains(question)) {
                count++;
                System.out.println(count);
                System.out.println(question);
                alreadyAsked.add(question);
            } else {
                continue;
            }
            String answer = answerSheet[random_questionnaire];
            String studentAnswer = input.nextLine();
            if (studentAnswer.equalsIgnoreCase(answer)) {
                System.out.println(praises[random_praise]);
                point++;
            } else {
                System.out.println(motivations[random_motivation]);
            }
            if (count == questionnaires.length) {
                break;
            }
        }
        System.out.println("You got " + point + " points out of " + questionnaires.length + "!");
    }
}
