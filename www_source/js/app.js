"use strict";

const PAGE_WELCOME = "welcome";
const PAGE_WORD_BOOKS = "word-books";
const PAGE_WORDS = "words";
const PAGE_START_PLAY = "start-play";
const PAGE_QUIZ = "quiz";
const PAGE_RESULTS = "results";
const PAGE_EXIT = "quit";

class App {
    constructor() {
        this._data = {
            wordBooks: [
                {id: "15b4d3d7-7a7d-093d-6eba-6b12f4aa942b", name: "EN verbs", wordCount: 0}
            ],
            words: [
                {
                    id: "15b4d3e1-26c9-1c09-fe3e-13016eb1f5ac",
                    bookId: "15b4d3d7-7a7d-093d-6eba-6b12f4aa942b",
                    word: "go",
                    meaning: "идти",
                    type: "verb"
                },
                {
                    id: "15b4da5f-b338-8c1b-8eb6-33d9996acd3d",
                    bookId: "15b4d3d7-7a7d-093d-6eba-6b12f4aa942b",
                    word: "sleep",
                    meaning: "спать",
                    type: "verb"
                },
                {
                    id: "15b4da61-b905-3bc9-d253-130742ec91f0",
                    bookId: "15b4d3d7-7a7d-093d-6eba-6b12f4aa942b",
                    word: "run",
                    meaning: "бежать",
                    type: "verb"
                },
                {
                    id: "15b4da63-be32-59dd-8dff-bbfc6a54e7e2",
                    bookId: "15b4d3d7-7a7d-093d-6eba-6b12f4aa942b",
                    word: "jump",
                    meaning: "прыгать",
                    type: "verb"
                },
                {
                    id: "15b4da66-d56c-2b13-0d5f-95790c955e9b",
                    bookId: "15b4d3d7-7a7d-093d-6eba-6b12f4aa942b",
                    word: "walk",
                    meaning: "идти",
                    type: "verb"
                },
                {
                    id: "15b5306a-7bff-1506-04cd-d6469c484f05",
                    bookId: "15b4d3d7-7a7d-093d-6eba-6b12f4aa942b",
                    word: "shy",
                    meaning: "стесняться",
                    type: "verb"
                }
            ],
            quizData: {
                books: [],
                words: [],
                wordsByTypes: {},
                useTypes: 0,
                position: 0,
                correct: 0
            },
            results: []
        };
        this._wordsById = {};
        this._wordBooksById = {};
    }

    init() {
        document.addEventListener("backbutton", this.onBackClick.bind(this), false);

        this.loadData();

        webix.ui({
            rows: [
                this.toolBar,
                {
                    id: "main-content",
                    autowidth: true,
                    cells: [
                        this.pageWelcome,
                        this.pageWorkBook,
                        this.pageWords,
                        this.pagePlayStart,
                        this.pageQuiz,
                        this.pageResult
                    ],
                    on: {
                        onViewChange: webix.bind(this.onViewChanged, this)
                    }
                }
            ]
        });

        webix.ui({
            id: "app_menu",
            view: "sidemenu",
            width: 200,
            position: "left",
            state: function (state) {
                let toolbarHeight = $$("toolbar").$height;
                state.top = toolbarHeight;
                state.height -= toolbarHeight;
            },
            body: {
                view: "list",
                borderless: true,
                scroll: false,
                template: "<span class='webix_icon fa-#icon#'></span> #value#",
                data: [
                    {id: PAGE_WELCOME, value: _t("menu_welcome"), icon: "home"},
                    {id: PAGE_WORD_BOOKS, value: _t("menu_wordbooks"), icon: "cubes"},
                    {id: PAGE_WORDS, value: _t("menu_words"), icon: "cube"},
                    {value: "", disabled: true},
                    {id: PAGE_START_PLAY, value: _t("menu_play"), icon: "check-square-o"},
                    {id: PAGE_RESULTS, value: _t("menu_results"), icon: "line-chart"},
                    {value: "", disabled: true},
                    {id: PAGE_EXIT, value: _t("menu_exit"), icon: "sign-out"}
                ],
                select: false,
                type: {
                    height: 40
                },
                click: webix.bind(this.switchPage, this)
            }
        });

        return this;
    }

    get toolBar() {
        return {
            id: "toolbar",
            view: "toolbar",
            elements: [
                {
                    view: "icon",
                    icon: "bars",
                    click() {
                        if ($$("app_menu").config.hidden) {
                            $$("app_menu").show();
                        } else {
                            $$("app_menu").hide();
                        }
                    }
                },
                {
                    id: "app-title",
                    view: "label",
                    label: _t("app_title")
                }
            ]
        };
    }

    get pageWelcome() {
        let buttonPadding = 20;
        let buttonStyles = "button_primary button_raised";

        return {
            id: PAGE_WELCOME,
            rows: [
                {
                    gravity: 1,
                    autoheight: true,
                    rows: [
                        {},
                        {
                            view: "label",
                            label: _t("app_title"),
                            align: "center",
                            css: {
                                "font-size": "2em"
                            }
                        },
                        {
                            view: "label",
                            label: _t("app_description"),
                            align: "center",
                            css: "text_info"
                        },
                        {}
                    ]
                },
                {
                    gravity: 4,
                    autoheight: true,
                    margin: 20,
                    cols: [
                        {
                            gravity: 1
                        },
                        {
                            gravity: 10,
                            rows: [
                                {},
                                {
                                    view: "button",
                                    value: _t("manage_wordbooks"),
                                    css: buttonStyles,
                                    align: "center",
                                    click: () => {
                                        this.switchPage(PAGE_WORD_BOOKS);
                                    }
                                },
                                {height: buttonPadding},
                                {
                                    view: "button",
                                    value: _t("manage_words"),
                                    css: buttonStyles,
                                    align: "center",
                                    click: () => {
                                        this.switchPage(PAGE_WORDS);
                                    }
                                },
                                {height: buttonPadding},
                                {
                                    view: "button",
                                    value: _t("start_quiz"),
                                    css: buttonStyles,
                                    align: "center",
                                    click: () => {
                                        this.switchPage(PAGE_START_PLAY);
                                    }
                                },
                                {height: buttonPadding},
                                {
                                    view: "button",
                                    value: _t("view_results"),
                                    css: buttonStyles,
                                    align: "center",
                                    click: () => {
                                        this.switchPage(PAGE_RESULTS);
                                    }
                                },
                                {height: buttonPadding},
                                {
                                    view: "button",
                                    value: _t("exit"),
                                    css: buttonStyles,
                                    align: "center",
                                    click: () => {
                                        this.switchPage(PAGE_EXIT);
                                    }
                                },
                                {}
                            ]
                        },
                        {
                            gravity: 1
                        }
                    ]
                },
            ],
            on: {
                onShow: () => {
                    App.appTitle = _t("app_title");
                }
            }
        };
    }

    get pageWorkBook() {
        let _addEmptyLine = (grid) => {
            let tmp = grid.getItem(grid.getLastId());
            if(!tmp || tmp.word && tmp.meaning) {
                grid.add({id:BTUtils.generateGUID(), name: "", wordCount: 0});
            }
        };

        return {
            id: PAGE_WORD_BOOKS,
            rows: [
                {
                    id: "word-books-grid",
                    view: "datatable",
                    columns: [
                        {id: "name", header: _t("name"), editor: "text", fillspace: true},
                        {id: "wordCount", header: _t("wordsCount")}
                    ],
                    editable: true,
                    scrollX: false,
                    on: {
                        onAfterEditStop: (state, editor, ignore) => {
                            if(ignore || state.value === state.old) {
                                return;
                            }

                            let grid = $$("word-books-grid");
                            let item = grid.getItem(editor.row);

                            let book = this._wordBooksById[item.id];
                            if(book) {
                                book.name = String(state.value).trim();
                            } else {
                                book = this.addNewWordBook(state.value, item.id);
                                grid.updateItem(item.id, book);

                                _addEmptyLine(grid);
                            }

                            this.saveData();

                            // remove empty books without names
                            if(!book.name && !book.wordCount) {
                                webix.delay(() => {
                                    let grid = $$("word-books-grid");
                                    if(grid) {
                                        grid.editStop();
                                        grid.remove(book.id);
                                    }

                                    this.deleteWordBook(book.id);

                                    this.saveData();

                                    _addEmptyLine(grid);
                                });
                            }
                        },
                        onItemClick: (pos) => {
                            if (pos.column === "wordCount") {
                                let book = this._wordBooksById[pos.row];
                                if (book) {
                                    $$(PAGE_WORDS).callEvent("selWorkBook", [book.id]);
                                    this.switchPage(PAGE_WORDS);
                                }
                            }
                        }
                    }
                }
            ],
            on: {
                onShow: () => {
                    App.appTitle = _t("menu_wordbooks");

                    let grid = $$("word-books-grid");
                    grid.clearAll();

                    let rows = [];
                    let WBcnt = this.countWordsForBooks();
                    this._data.wordBooks.forEach((vv) => {
                        vv.wordCount = WBcnt[vv.id] ? WBcnt[vv.id] : 0;
                        rows.push(vv);
                    });

                    grid.parse(rows);

                    _addEmptyLine(grid);
                },
                onHide: () => {
                    let grid = $$("word-books-grid");
                    grid.editStop();
                    grid.clearAll();
                }
            }
        };
    }

    get pageWords() {
        let doSelWorkBook = null;
        let types = [];
        App.WordTypes.forEach((v) => {
            types.push({id:v, value:_t("type_"+v)});
        });

        let _addEmptyLine = (grid) => {
            let tmp = grid.getItem(grid.getLastId());
            if(!tmp || tmp.word && tmp.meaning) {
                grid.add({id: BTUtils.generateGUID(), word: "", meaning: "", type: "none"});
            }
        };

        return {
            id: PAGE_WORDS,
            rows: [
                {
                    id: "words-work-book-selection",
                    view: "richselect",
                    label: _t("wordbook"),
                    options: [],
                    on: {
                        onChange: (id) => {
                            let grid = $$("words-grid");
                            grid.clearAll();

                            let rows = [];
                            this._data.words.forEach((vv) => {
                                if(vv.bookId === id) {
                                    rows.push(vv);
                                }
                            });

                            grid.parse(rows);

                            _addEmptyLine(grid);
                        }
                    }
                },
                {
                    id: "words-grid",
                    view: "datatable",
                    columns: [
                        {id: "word", header: _t("word"), editor: "text", fillspace: true},
                        {id: "meaning", header: _t("meaning"), editor: "text", fillspace: true},
                        {
                            id: "type",
                            header: _t("type"),
                            editor: "select",
                            options: types,
                            width: 100
                        }
                    ],
                    editable: true,
                    scrollX: false,
                    on: {
                        onBeforeEditStart: (pos) => {
                            if(pos.column === "type") {
                                let item = $$("words-grid").getItem(pos.row);
                                if(!item.word && !item.meaning) {
                                    return false;
                                }
                            }

                            let combo = $$("words-work-book-selection");
                            let bookId = combo.getValue();
                            return !!bookId;
                        },
                        onAfterEditStop: (state, editor, ignore) => {
                            if(ignore || (state.value && state.value === state.old)) {
                                return;
                            }

                            let grid = $$("words-grid");
                            let item = grid.getItem(editor.row);

                            let combo = $$("words-work-book-selection");
                            let bookId = combo.getValue();
                            if(!bookId) return;

                            let word = this._wordsById[item.id];
                            if(word) {
                                word[editor.column] = state.value;
                            } else {
                                word = this.addNewWord(bookId, item.id);
                                word[editor.column] = state.value;
                                grid.updateItem(item.id, word);

                                _addEmptyLine(grid);
                            }

                            this.saveData();

                            // remove empty words without names
                            if(!word.word && !word.meaning/* && !word.type*/) {
                                webix.delay(() => {
                                    let grid = $$("words-grid");
                                    if(grid) {
                                        grid.editStop();
                                        grid.remove(word.id);
                                    }

                                    this.deleteWord(word.id);

                                    this.saveData();

                                    _addEmptyLine(grid);
                                });
                            }
                        }
                    }
                }
            ],
            on: {
                selWorkBook: (id) => {
                    doSelWorkBook = id;
                },
                onShow: () => {
                    App.appTitle = _t("menu_words");

                    let grid = $$("words-grid");
                    grid.clearAll();

                    let combo = $$("words-work-book-selection");
                    let prevBook = combo.getValue();
                    combo.setValue("");

                    let rows = [];
                    this._data.wordBooks.forEach((vv) => {
                        rows.push({id:vv.id, value:vv.name});
                    });

                    combo.define("options", rows);

                    if(doSelWorkBook) {
                        combo.setValue(doSelWorkBook);
                        doSelWorkBook = null;
                    } else if(prevBook){
                        combo.setValue(prevBook);
                    } else if(rows.length > 0) {
                        combo.setValue(rows[0].id);
                    }
                },
                onHide: () => {
                    let grid = $$("words-grid");
                    grid.editStop();
                    grid.clearAll();
                }
            }
        };
    }

    get pagePlayStart() {
        return {
            id: PAGE_START_PLAY,
            rows: [
                {
                    id: "continue_test",
                    view: "button",
                    hidden: true,
                    value: _t("continue_last_testing"),
                    click: () => {
                        this.switchPage(PAGE_QUIZ);
                    }
                },
                {
                    gravity: 2,
                    rows: [
                        {},
                        {
                            view: "label",
                            label: _t("choose_wordbooks"),
                            align: "center",
                        },
                        {}
                    ]
                },
                {
                    id: "wordbooks-for-quiz",
                    view: "datatable",
                    gravity: 8,
                    autoHeight: true,
                    columns: [
                        {
                            id: "select",
                            header: "",
                            checkValue: 1,
                            uncheckValue: 0,
                            template: "{common.checkbox()}",
                            width: 40
                        },
                        {id: "name", header: _t("wordbook"), fillspace: true},
                        {id: "wordCount", header: _t("wordsCount"), fillspace: true}
                    ],
                    scrollX: false,
                    on: {
                        onItemClick(pos) {
                            let item = this.getItem(pos.row);
                            item.select = item.select ? 0 : 1;
                            this.updateItem(item.id, item);
                        }
                    }
                },
                {
                    gravity: 1,
                    rows: [
                        {
                        },
                        {
                            cols: [
                                {},
                                {
                                    id: "use-word-types",
                                    view: "checkbox",
                                    label: _t("use_word_types"),
                                    width: 200,
                                    labelWidth: 170,
                                    align: "center"
                                },
                                {}
                            ]
                        },
                        {
                            cols: [
                                {},
                                {
                                    view: "button",
                                    value: _t("start"),
                                    click: () => {
                                        let books = [];
                                        let grid = $$("wordbooks-for-quiz");
                                        grid.data.each(function(v) {
                                            if(v.select) books.push(v.id);
                                        });

                                        let check = $$("use-word-types").getValue();

                                        if(books.length > 0) {
                                            if(!this.initNewQuiz(books, check)) {
                                                webix.alert(_t("required_min_words"));
                                                return;
                                            }

                                            this.saveData();
                                            this.switchPage(PAGE_QUIZ);
                                        }
                                    }
                                },
                                {}
                            ]
                        },
                        {
                        }
                    ]
                }
            ],
            on: {
                onShow: () => {
                    App.appTitle = _t("menu_play");

                    let grid = $$("wordbooks-for-quiz");
                    grid.clearAll();

                    let rows = [];
                    let WBcnt = this.countWordsForBooks();
                    this._data.wordBooks.forEach((vv) => {
                        vv.wordCount = WBcnt[vv.id] ? WBcnt[vv.id] : 0;
                        rows.push(vv);
                    });

                    grid.parse(rows);

                    if(this._data.quizData.books.length && this._data.quizData.words.length && this._data.quizData.position < this._data.quizData.words.length) {
                        $$("continue_test").show();
                    }

                    $$("use-word-types").setValue(this._data.quizData.useTypes);
                },
                onHide: () => {
                    let grid = $$("wordbooks-for-quiz");
                    grid.editStop();
                    grid.clearAll();
                }
            }
        };
    }

    get pageQuiz() {
        let buttonPadding = 20;
        let buttonStyles = "button_primary button_raised";
        let buttonStylesSuccess = "button_success button_raised";
        let buttonStylesFail = "button_danger button_raised";
        let correctAnswer = null;

        let _onAnswerClick = (buttonNum) => {
            if(correctAnswer === null) return;

            let childs = $$("quiz-answers").getChildViews();
            let isCorrect = buttonNum === correctAnswer;
            correctAnswer = null;

            if(isCorrect) {
                webix.html.addCss( childs[buttonNum * 2 + 1].getNode(), buttonStylesSuccess);

                ++this._data.quizData.correct;
            } else {
                webix.html.addCss( childs[buttonNum * 2 + 1].getNode(), buttonStylesFail);
            }

            setTimeout(() => {
                if(!$$("quiz-answers")) return;

                let childs = $$("quiz-answers").getChildViews();
                webix.html.removeCss( childs[buttonNum * 2 + 1].getNode(), buttonStylesSuccess);
                webix.html.removeCss( childs[buttonNum * 2 + 1].getNode(), buttonStylesFail);
                webix.html.addCss( childs[buttonNum * 2 + 1].getNode(), buttonStyles);

                $$(PAGE_QUIZ).callEvent("nextWord");
            }, 500);
        };

        return {
            id: PAGE_QUIZ,
            rows: [
                {
                    gravity: 1,
                    autoheight: true,
                    rows: [
                        {},
                        {
                            id: "quiz-word",
                            view: "label",
                            align: "center",
                            css: {
                                "font-size": "2em"
                            }
                        },
                        {}
                    ]
                },
                {
                    gravity: 4,
                    autoheight: true,
                    margin: 20,
                    cols: [
                        {
                            gravity: 1
                        },
                        {
                            id: "quiz-answers",
                            gravity: 10,
                            rows: [
                                {},
                                {
                                    view: "button",
                                    value: "",
                                    css: buttonStyles,
                                    align: "center",
                                    click: () => _onAnswerClick(0, this)
                                },
                                {height: buttonPadding},
                                {
                                    view: "button",
                                    value: "",
                                    css: buttonStyles,
                                    align: "center",
                                    click: () => _onAnswerClick(1, this)
                                },
                                {height: buttonPadding},
                                {
                                    view: "button",
                                    value: "",
                                    css: buttonStyles,
                                    align: "center",
                                    click: () => _onAnswerClick(2, this)
                                },
                                {height: buttonPadding},
                                {
                                    view: "button",
                                    value: "",
                                    css: buttonStyles,
                                    align: "center",
                                    click: () => _onAnswerClick(3, this)
                                },
                                {}
                            ]
                        },
                        {
                            gravity: 1
                        }
                    ]
                },
                {
                    id: "quiz-position",
                    height: 20,
                    view: "label",
                    label: "5/10",
                    align: "right"
                }
            ],
            on: {
                onShow: () => {
                    App.appTitle = _t("menu_play");

                    if (!this._data.quizData.books.length) {
                        this.switchPage(PAGE_RESULTS);
                        return;
                    }

                    if(this._data.quizData.position >= this._data.quizData.words.length) {
                        this.initNewQuiz();
                    }

                    $$(PAGE_QUIZ).callEvent("showWord");
                },

                showWord: () => {
                    $$("quiz-word").setValue("");

                    let wordId = this._data.quizData.words[this._data.quizData.position];
                    let currentWord = this._wordsById[wordId];
                    if(!currentWord) {
                        $$(PAGE_QUIZ).callEvent("nextWord");
                        return;
                    }

                    let arr, pos, word, variants = [];
                    $$("quiz-word").setValue(currentWord.word);
                    variants.push(currentWord.meaning);

                    if(!this._data.quizData.useTypes || !this._data.quizData.wordsByTypes[currentWord.type] || this._data.quizData.wordsByTypes[currentWord.type].length < 5) {
                        arr = this._data.quizData.words;
                    } else {
                        arr = this._data.quizData.wordsByTypes[currentWord.type];

                        // check for available meanings for answers from word group
                        let qq, check = 0;
                        for(qq = 0; check < 4 && qq < arr.length; ++qq) {
                            check += (arr[qq].word !== currentWord.word && arr[qq].meaning !== currentWord.meaning) ? 1 : 0;
                        }

                        if(check < 4) {
                            // will use all words for build answers
                            arr = this._data.quizData.words;
                        }
                    }

                    while(variants.length < 4) {
                        pos = Math.floor(Math.random() * arr.length);
                        while(1) {
                            word = this._wordsById[arr[pos % arr.length]];
                            if(word.word !== currentWord.word && variants.indexOf(word.meaning) < 0) {
                                variants.push(word.meaning);
                                break;
                            }
                            ++pos;
                        }

                        // if not possible to collect answers - go to next word
                        if(pos > arr.length * 2) {
                            $$(PAGE_QUIZ).callEvent("nextWord");
                            return
                        }
                    }

                    App.shuffleArray(variants);
                    correctAnswer = variants.indexOf(currentWord.meaning);

                    let childs = $$("quiz-answers").getChildViews();
                    childs[1].define("label", variants[0]); childs[1].refresh();
                    childs[3].define("label", variants[1]); childs[3].refresh();
                    childs[5].define("label", variants[2]); childs[5].refresh();
                    childs[7].define("label", variants[3]); childs[7].refresh();

                    $$("quiz-position").setValue((this._data.quizData.position + 1) + "/" + this._data.quizData.words.length);

                    this.saveData();
                },

                nextWord: () => {
                    if((++this._data.quizData.position) < this._data.quizData.words.length) {
                        $$(PAGE_QUIZ).callEvent("showWord");
                        return;
                    }

                    let book, qbooks = [];
                    this._data.quizData.books.forEach((bookId) => {
                        book = this._wordBooksById[bookId];
                        if(book) qbooks.push(book.name);
                    });

                    this._data.results.push({
                        wordBooks: qbooks.join(", "),
                        correct: this._data.quizData.correct,
                        total: this._data.quizData.words.length
                    });

                    this.saveData();

                    this.switchPage(PAGE_RESULTS);
                }
            }
        };
    }

    get pageResult() {
        return {
            id: PAGE_RESULTS,
            rows: [
                {
                    id: "result-grid",
                    view: "datatable",
                    columns: [
                        {id: "wordBooks", header: _t("wordbooks"), fillspace: true},
                        {id: "correct", header: _t("correct")},
                        {id: "total", header: _t("total")}
                    ],
                    editable: true,
                    scrollX: false
                },
                {
                    rows: [
                        {height: 10},
                        {
                            cols: [
                                {},
                                {
                                    view: "button",
                                    value: _t("back_to_main"),
                                    click: () => {
                                        this.switchPage(PAGE_WELCOME);
                                    }
                                },
                                {},
                            ]
                        },
                        {height: 10},
                    ]
                }
            ],
            on: {
                onShow: () => {
                    App.appTitle = _t("menu_results");

                    let grid = $$("result-grid");
                    grid.parse(this._data.results);
                },
                onHide: () => {
                    let grid = $$("result-grid");
                    grid.clearAll();
                }
            }
        };
    }

    switchPage(name) {
        if (name === PAGE_EXIT) {
            if(window.navigator && navigator.app && navigator.app.exitApp) {
                navigator.app.exitApp();
            }
            return;
        }

        if ($$("main-content") && $$(name)) {
            $$("main-content").setValue(name);

            if ($$("app_menu")) {
                $$("app_menu").hide();
            }
        }
    }

    onBackClick(event) {
        if(event) {
            event.stopPropagation();
            event.preventDefault();
        }

        $$("main-content").back();
    }

    onViewChanged(prevID, nextID) {
        let obj;

        obj = $$(prevID);
        if(obj) {
            obj.callEvent("onHide");
        }

        obj = $$(nextID);
        if(obj) {
            obj.callEvent("onShow");
        }
    }

    saveData() {
        webix.storage.local.put("BTWB_app", this._data);
    }

    loadData() {
        let data = webix.storage.local.get("BTWB_app");
        if (data) {
            this._data = data;
        }

        this.rebuildCaches();
    }

    rebuildCaches() {
        this.rebuildWordBooksCaches();
        this.rebuildWordsCaches();
    }

    rebuildWordBooksCaches() {
        let qq;
        this._wordBooksById = {};
        for(qq = 0; qq < this._data.wordBooks.length; ++qq) {
            this._wordBooksById[this._data.wordBooks[qq].id] = this._data.wordBooks[qq];
        }
    }

    rebuildWordsCaches() {
        let qq;
        this._wordsById = {};
        for(qq = 0; qq < this._data.words.length; ++qq) {
            this._wordsById[this._data.words[qq].id] = this._data.words[qq];
        }
    }

    addNewWordBook(name, id) {
        let book = {
            id: id ? id : BTUtils.generateGUID(),
            name: String(name).trim(),
            wordCount: 0
        };

        this._data.wordBooks.push(book);
        this._wordBooksById[book.id] = book;

        return book;
    }

    deleteWordBook(id) {
        let qq;
        for(qq = 0; qq < this._data.wordBooks.length; ++qq) {
            if(this._data.wordBooks[qq].id === id) {
                this._data.wordBooks.splice(qq, 1);

                if(this._wordBooksById[id]) {
                    delete this._wordBooksById[id];
                }

                return;
            }
        }
    }

    addNewWord(bookId, id) {
        let word = {
            id: id ? id : BTUtils.generateGUID(),
            bookId: bookId,
            word: "",
            meaning: "",
            type: ""
        };

        this._data.words.push(word);
        this._wordsById[word.id] = word;

        return word;
    }

    deleteWord(id) {
        let qq;
        for(qq = 0; qq < this._data.words.length; ++qq) {
            if(this._data.words[qq].id === id) {
                this._data.words.splice(qq, 1);

                if(this._wordsById[id]) {
                    delete this._wordsById[id];
                }

                return;
            }
        }
    }

    initNewQuiz(books, useTypes) {
        this.rebuildCaches();

        this._data.quizData.books = typeof books !== "undefined" ? books : this._data.quizData.books;
        this._data.quizData.useTypes = typeof useTypes !== "undefined" ? (useTypes ? 1 : 0) : this._data.quizData.useTypes;
        this._data.quizData.position = 0;
        this._data.quizData.correct = 0;
        this._data.quizData.words = [];
        this._data.quizData.wordsByTypes = {};

        if(!this._data.quizData.books.length) {
            return;
        }

        let qq, word;
        for(qq = 0; qq < this._data.words.length; ++qq) {
            word = this._data.words[qq];
            if(!word || !word.word || !word.meaning || this._data.quizData.books.indexOf(word.bookId) < 0) {
                continue;
            }

            this._data.quizData.words.push(word.id);
            if(!this._data.quizData.wordsByTypes[word.type]) {
                this._data.quizData.wordsByTypes[word.type] = [];
            }
            if(this._data.quizData.wordsByTypes[word.type].indexOf(word.meaning) < 0) {
                this._data.quizData.wordsByTypes[word.type].push(word.id);
            }
        }

        App.shuffleArray(this._data.quizData.words);

        return (this._data.quizData.words.length >= 5);
    }

    countWordsForBooks() {
        let cnt = {};
        let qq;
        for(qq = 0; qq < this._data.words.length; ++qq) {
            if(!cnt[this._data.words[qq].bookId]) {
                cnt[this._data.words[qq].bookId] = 0;
            }
            ++cnt[this._data.words[qq].bookId];
        }
        return cnt;
    }

    /**
     * Shuffles array in place.
     * @param {Array} arr -- the array with items to shuffle
     * @returns {Array}
     */
    static shuffleArray(arr) {
        let qq, ww;
        for (qq = arr.length; qq > 0; --qq) {
            ww = Math.floor(Math.random() * qq);
            if(qq !== ww) {
                [arr[qq - 1], arr[ww]] = [arr[ww], arr[qq - 1]];
            }
        }
        return arr;
    }

    static set appTitle(val) {
        $$("app-title").setValue(val ? val : _t("app_title"));
    }
}

App.WordTypes = ["none", "noun", "verb", "adv", "adj", "tenses", "number", "decline"];

BTLocalization.add({
    en: {
        // app
        "app_title": "Learn what you need",
        "app_description": "This app will help learn the words exactly that you need.",

        // menu
        "menu_welcome": "Welcome",
        "menu_wordbooks": "Wordbooks",
        "menu_words": "Words",
        "menu_play": "Test",
        "menu_results": "Results",
        "menu_exit": "Exit",

        // other
        "manage_wordbooks": "Manage word books",
        "manage_words": "Manage words",
        "start_quiz": "Test",
        "view_results": "Results",
        "exit": "Exit",
        "back_to_main": "Back to main",
        "continue_last_testing": "Continue last testing",
        "use_word_types": "Use word types",

        "name": "Name",
        "wordbook": "Wordbook",
        "wordbooks": "Wordbooks",
        "wordsCount": "Words Count",
        "choose_wordbooks": "Choose word-books",
        "word": "Word",
        "meaning": "Meaning",
        "type": "Type",
        "required_min_words": "Required 5 words or more",
        "correct": "Correct",
        "total": "Total",
        "start": "Start",

        "type_none": "",
        "type_noun": "noun",
        "type_verb": "verb",
        "type_adv": "adv",
        "type_adj": "adj",
        "type_tenses": "tenses",
        "type_number": "number",
        "type_decline": "decline"
    },
    ru: {
        // app
        "app_title": "Учи то, что тебе надо",
        "app_description": "Это приложение поможет выучить именно те слова, которые нужны Вам.",

        // menu
        "menu_welcome": "Главная",
        "menu_wordbooks": "Словари",
        "menu_words": "Слова",
        "menu_play": "Тест",
        "menu_results": "Результаты",
        "menu_exit": "Выход",

        // other
        "manage_wordbooks": "Редактирование словарей",
        "manage_words": "Редактирование слов",
        "start_quiz": "Тест",
        "view_results": "Результаты",
        "exit": "Выход",
        "back_to_main": "На главную",
        "continue_last_testing": "Продолжить последний тест",
        "use_word_types": "Учитывать типы",

        "name": "Название",
        "wordbook": "Словарь",
        "wordbooks": "Словари",
        "wordsCount": "Кол-во слов",
        "choose_wordbooks": "Выберите словари",
        "word": "Слово",
        "meaning": "Значение",
        "type": "Тип",
        "required_min_words": "Требуется не менее 5 слов",
        "correct": "Верно",
        "total": "Всего",
        "start": "Начать",

        "type_none": "",
        "type_noun": "сущ.",
        "type_verb": "глагол",
        "type_adv": "наречие",
        "type_adj": "прилаг.",
        "type_tenses": "времена",
        "type_number": "числа",
        "type_decline": "склонение"
    }
});

webix.ready(() => {
    window.app = (new App()).init();
});