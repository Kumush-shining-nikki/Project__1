const { default: mongoose } = require("mongoose");
const { newsModel } = require("../models/news.model");
const dotenv = require("dotenv");
const categoryModel = require("../models/category.model");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const { newsSchema } = require("../validator/add.news.validate");
dotenv.config();

exports.getAllNews = async (req, res) => {
  try {
    const token = req.cookies.token;
    const news = await newsModel
      .find()
      .sort({ createdAt: -1 })
      .limit(50)
      .populate("author", "username");
    const item = await newsModel
      .find()
      .sort({ createdAt: -1 })
      .limit(4)
      .populate("author", "username");
    if (req.cookies.token) {
      const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const userId = req.cookies.userId;
      console.log(news);
      if (user.roles == "ADMIN") {
        return res.render("index", {
          news,
          item,
          user,
          token,
          userId,
          isAdmin: true,
        });
      } else if (user.roles == "USER") {
        return res.render("index", {
          news,
          item,
          token,
          user,
          userId,
        });
      }
    } else {
      return res.render("index", {
        news,
        item,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).redirect("/api/500")
  }
};

exports.addNewsPage = async (req, res) => {
  const token = req.cookies.token
  res.render("add", {
    token,
    addNewsError: req.flash("addNewsError")
  });
};

exports.addNews = async (req, res) => {
  try {
    const author = req.cookies.userId;
    console.log(author);

    const { value, error } = newsSchema.validate(req.body);

    if(error) {
      if(error.details) {
        const errMsg = error.details[0].message
        req.flash("addNewsError", errMsg)
        return res.redirect("/api/add")

      } else {
        throw error;
      }
    }

    function formatDate(date) {
      const d = new Date(date);
      const hours = d.getHours();
      const minutes = d.getMinutes();
      const day = d.getDate();
      const month = d.getMonth() + 1;
      const year = String(d.getFullYear()).slice(-2);
      return `${day}/${month}/${year}, ${hours}:${String(minutes).padStart(
        2,
        "0"
      )}`;
    }
    const now = new Date();
    const formattedDate = formatDate(now);

    const category = req.body.category
    const categoryData = await categoryModel.findOne({ category: category});

    if(!categoryData) {
      return res.status(404).redirect("/api/404")
    }
    

    const news = await newsModel.create({
      title: value.title,
      content: value.content,
      image: value.image,
      author,
      category: categoryData._id,
      createdAt: formattedDate,
    });

    const onenews = await newsModel.findById({ _id: news.id})

   return res.redirect(`/api/news/${onenews.id}`)
  } catch (error) {
    console.log(error);
    return res.status(500).redirect("/api/500")
  }
};

exports.getUpdatedNews = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const news = await newsModel
      .findById(id)
      .populate("author", "username")
      .populate("category", "category");
    const token = req.cookies.token;
    const user = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = req.cookies.userId;

    res.render("update-news", {
      token,
      news,
      user,
      userId,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).redirect("/api/500")
  }
};

exports.updatedNews = async (req, res) => {
  const {
    params: { id },
  } = req;
  const body = req.body;
  try {
    const updateNews = body;
    const oldNews = await newsModel.findById(id);
    const category = await categoryModel.findOne({
      category: updateNews.category,
    });

    function formatDate(date) {
      const d = new Date(date);
      const hours = d.getHours();
      const minutes = d.getMinutes();
      const day = d.getDate();
      const month = d.getMonth() + 1;
      const year = String(d.getFullYear()).slice(-2);
      return `${day}/${month}/${year}, ${hours}:${String(minutes).padStart(
        2,
        "0"
      )}`;
    }
    const now = new Date();
    const formattedDate = formatDate(now);

    const updatedData = {
      title: updateNews.title,
      content: updateNews.content || oldNews.content, 
      image: updateNews.image || oldNews.image,
      category: category || oldNews.category,
      createdAt: oldNews.createdAt,
      updatedAt: formattedDate,
      author: oldNews.author,
    };

    await newsModel.findByIdAndUpdate(id, updatedData);

    
    return res.redirect(`/api/news/${id}`);
  } catch (error) {
    console.log(error);
    return res.status(500).redirect("/api/500")
  }
};

exports.deletedNews = async (req, res) => {
  const { params: { id } } = req 
  try {
    const news = await newsModel.findById(id)
    const token = req.cookies.token
    const user = jwt.verify(token, process.env.JWT_SECRET_KEY)

    if (user.roles == "ADMIN" || news.author.toString() == req.cookies.userId) {
      await newsModel.findByIdAndDelete(id)
      return res.redirect("/api")
    }
  } catch (error) {
    console.log(error);
    return res.status(500).redirect("/api/500")
  }
};

exports.LatestNews = async (req, res) => {
  try {
    const news = await newsModel
      .find()
      .sort({ createdAt: -1 })
      .limit(15)
      .populate("author", "username");
    const item = await newsModel
      .find()
      .sort({ createdAt: -1 })
      .limit(15)
      .populate("author", "username");
    const token = req.cookies.token;
    if (req.cookies.token) {
      const user = await jwt.verify(token, process.env.JWT_SECRET_KEY);
      const userId = req.cookies.userId;
      return res.render("latest-news", {
        news,
        user,
        userId,
        token,
        item,
      });
    } else {
      return res.render("latest-news", {
        news,
        token,
        item,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).redirect("/api/500")
  }
};

exports.getOneNews = async (req, res) => {
  const {
    params: { id },
  } = req;
  
  try {
    const news = await newsModel
      .findById({ _id: id })
      .populate("author", "username")
      .populate("category", "category");
    const token = req.cookies.token;
    if (req.cookies.token) {
      const user = await jwt.verify(token, process.env.JWT_SECRET_KEY);
      const userId = req.cookies.userId;
      if (news.author._id.toString() == userId || user.roles == "ADMIN") {
        return res.render("one-news", {
          news,
          user,
          userId,
          token,
          isAdmin: true,
        });
      } else {
        return res.render("one-news", {
          news,
          user,
          userId,
          token,
        });
      }
    } else {
      return res.render("one-news", {
        news,
        token,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).redirect("/api/500")
  }
};

exports.getAuthorNews = async (req, res) => {
  const { params: { id}  } = req
  try {
    const author = await userModel.findById(id)
    const news = await newsModel.find({author: author}).populate('author', 'username').populate('category',"category").sort({ createdAt: - 1})
    if (req.cookies.token) {
      const token = req.cookies.token
      const user = jwt.verify(token, process.env.JWT_SECRET_KEY)
      const userId = req.cookies.userId
      return res.render("author-news", {
        news,
        user,
        userId,
        author,
        token
      })
    } else {
      return res.render("author-news", {
        news,
        author,
        token
      })
    }

  } catch (error) {
    console.log(error);
    return res.status(500).redirect("/api/500")

  }
}

exports.localNews = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ category: "O'zbekiston" });
    const news = await newsModel
      .find({ category: category })
      .populate("category", "category")
      .populate("author", "username");
    const token = req.cookies.token;
    if (req.cookies.token) {
      const user = await jwt.verify(token, process.env.JWT_SECRET_KEY);
      const userId = req.cookies.userId;
      return res.render("local", {
        news,
        user,
        userId,
        token,
      });
    } else {
      return res.render("local", {
        news,
        token,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.globalNews = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ category: "Jahon" });
    const news = await newsModel
      .find({ category: category })
      .populate("category", "category")
      .populate("author", "username");
    const token = req.cookies.token;
    if (req.cookies.token) {
      const user = await jwt.verify(token, process.env.JWT_SECRET_KEY);
      const userId = req.cookies.userId;
      return res.render("global", {
        news,
        user,
        userId,
        token,
      });
    } else {
      return res.render("global", {
        news,
        token,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).redirect("/api/500")
  }
};

exports.sportNews = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ category: "Sport" });
    const news = await newsModel
      .find({ category: category })
      .populate("category", "category")
      .populate("author", "username");
    const token = req.cookies.token;
    if (req.cookies.token) {
      const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const userId = req.cookies.userId;
      return res.render("sport", {
        news,
        user,
        userId,
        token,
      });
    } else {
      return res.render("sport", {
        news,
        token,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).redirect("/api/500")
  }
};

exports.texnologiyaNews = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ category: "Texnologiya" });
    const news = await newsModel
      .find({ category: category })
      .populate("category", "category")
      .populate("author", "username");
    const token = req.cookies.token;
    if (req.cookies.token) {
      const user =  jwt.verify(token, process.env.JWT_SECRET_KEY);
      const userId = req.cookies.userId;
      return res.render("texnologiya", {
        news,
        user,
        userId,
        token,
      });
    } else {
      return res.render("texnologiya", {
        news,
        token,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).redirect("/api/500")
  }
};

exports.ErrorPage = async (req, res) => {
  const token = req.cookies.token;
  return res.status(404).render("404 page", {
    token,
  });
};


exports.ServerError = async (req, res) => {
  const token = req.cookies.token
  return res.status(500).render("500", {
    token
  })
}