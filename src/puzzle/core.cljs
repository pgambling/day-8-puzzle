(ns puzzle.core
  (:require [cljs.nodejs :as nodejs]))

(nodejs/enable-util-print!)

(def fnames [:Elliot :George :Harvey :John :Michael])
(def lnames [:Almond :Bixby :Crawford :Grace :Maxwell])
(def departments [:Customer-Service :Engineering :Finance :Manufacturing :Marketing])
(def oses [:Apple :Windows])

(defn valid-option? [option]
  (let [{:keys [fname lname dept os]} option]
    (not (or ;; check for any invalid cases and return false if any are found

      ;; "John's last name wasn't Crawford"
      (and (= fname :John) (= lname :Crawford))

      ;; "John worked in Customer Service"
      (and (= fname :John) (not= dept :Customer-Service))

      ;; "Mr Grace didn't work in manufacturing"
      (and (= lname :Grace) (= dept :Manufacturing))

      ;; "Mr Maxwell's Apple computer"
      (and (= lname :Maxwell) (not= os :Apple))

      ;; "Elliot's Windows computer"
      (and (= fname :Elliot) (not= os :Windows))

      ;; "computer in marketing, which was not Harvey's"
      (and (= dept :Marketing) (= fname :Harvey))

      ;; "Mr Crawford, whose first name wasn't Elliot"
      (and (= lname :Crawford) (= fname :Elliot))

      ;; "Mr Crawford did not work in engineering"
      (and (= lname :Crawford) (= dept :Engineering))

      ;; "Michael did not work in marketing"
      (and (= fname :Michael) (= dept :Marketing))

      ;; "engineering computer was not George Bixby"
      (and (= dept :Engineering) (= fname :George))

      ;; "George Bixby"
      (and (= fname :George) (not= lname :Bixby))

      ;; Rule #1: "Harvey" cannot be "Mr Almond"
      (and (= fname :Harvey) (= lname :Almond))

      ;; Rule #1: "Mr Almond" cannot be in finance
      (and (= lname :Almond) (= dept :Finance))

      ;; Rule #1: "Harvey" cannot be in finance
      (and (= fname :Harvey) (= dept :Finance))))))

(defn all-valid-options []
  (filter valid-option?
    (set
      (for [fname fnames
            lname lnames
            dept departments
            os oses
            :let [option {:fname fname
                          :lname lname
                          :dept dept
                          :os os}]]
        option))))

(defn apple-user? [option]
  (= :Apple (:os option)))

(defn windows-user? [option]
  (= :Windows (:os option)))

(defn correct-os-count [ans]
  (let [num-apple (count (filter apple-user? ans))
        num-windows (count (filter windows-user? ans))]
    (and (= 3 num-windows) (= 2 num-apple))))

;; "The Windows users were finance, Mr Almond, and Harvey"
(defn rule1 [ans]
  (let [windows-users (filter windows-user? ans)]
    (every?
      (fn [{:keys [dept lname fname]}]
        (or (= dept :Finance)
            (= lname :Almond)
            (= fname :Harvey)))
      windows-users)))

;; "Wednesday belonged to an Apple user"
(defn rule2 [ans]
  (apple-user? (nth ans 2)))

(defn rule4 [ans]
  (when-let [maxwell-idx (first (keep-indexed #(when (= :Maxwell (:lname %2)) %1) ans))]
    (let [maxwell (nth ans maxwell-idx)]
      (and

        ;; Maxwell's computer could only be taken on Wed or Thurs
        (or (= maxwell-idx 2) (= maxwell-idx 3))

        ;; Maxwell's computer was taken the day before Elliot's computer
        (= :Elliot (:fname (nth ans (inc maxwell-idx))))

        ;; Maxwell's computer was taken two days after marketing's computer
        (= :Marketing (:dept (nth ans (- maxwell-idx 2))))))))

(defn rule6 [ans]
  (and

    ;; "Michael's computer was taken on Tuesday")
    (= :Michael (:fname (nth ans 1)))

    ;; "Engineering computer was taken on Friday"
    (= :Engineering (:dept (nth ans 4)))))

(defn no-repeat-vals? [ans id]
  (= 5 (count (set (map id ans)))))

(defn no-duplicates? [ans]
  (and
    (no-repeat-vals? ans :fname)
    (no-repeat-vals? ans :lname)
    (no-repeat-vals? ans :dept)))

(defn valid-permutation? [ans]
  (and
    (rule2 ans)
    (rule6 ans)
    (correct-os-count ans)
    (rule1 ans)
    (rule4 ans)
    (no-duplicates? ans)))

; (defn answers []
;   (let [all-options (all-valid-options)]
;     (for [mon all-options
;           tue all-options
;           wed all-options
;           thu all-options
;           fri all-options
;           :let [possibility [mon tue wed thu fri]]]
;           ; :when (valid-permutation? possibility)]
;       possibility)))

(defn print-option! [day {:keys [fname lname dept os]}]
  (println (str day ": " (name fname) " " (name lname) ", " (name dept) ", " (name os))))

(defn print-permutation! [ans]
  (print-option! "Mon" (nth ans 0))
  (print-option! "Tue" (nth ans 1))
  (print-option! "Wed" (nth ans 2))
  (print-option! "Thu" (nth ans 3))
  (print-option! "Fri" (nth ans 4)))

(defn -main []
  (let [all-options (all-valid-options)]
    (println (count all-options))
    (doseq [mon all-options
            tue all-options
            wed all-options
            thu all-options
            fri all-options
            :let [possibility [mon tue wed thu fri]]]
      (when (valid-permutation? possibility)
        (print-permutation! possibility)))))

(set! *main-cli-fn* -main)
